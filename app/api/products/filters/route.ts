import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600; // Cache for 1 hour

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const selectedCategories = searchParams.get("categories")?.split(",").filter(Boolean) || [];
    const productType = searchParams.get("type") as "rental" | "purchase" | "all" || "all";

    // Build where clause based on filters
    const whereClause: any = {
      isActive: true,
      quantity: {
        gt: 0,
      },
    };

    // Apply type filter
    if (productType === "rental") {
      whereClause.rentalPrice = {
        gt: 0,
      };
    } else if (productType === "purchase") {
      whereClause.purchasePrice = {
        gt: 0,
      };
    }

    // Apply category filter if categories are selected
    if (selectedCategories.length > 0) {
      whereClause.category = {
        in: selectedCategories,
      };
    }

    // Get categories with counts using groupBy (only filtered by type, not by selected categories)
    const categoryWhereClause: any = {
      isActive: true,
      quantity: {
        gt: 0,
      },
    };

    // Apply type filter to category aggregation
    if (productType === "rental") {
      categoryWhereClause.rentalPrice = {
        gt: 0,
      };
    } else if (productType === "purchase") {
      categoryWhereClause.purchasePrice = {
        gt: 0,
      };
    }

    const categoryAggregation = await prisma.product.groupBy({
      by: ['category'],
      where: categoryWhereClause,
      _count: {
        category: true,
      },
      orderBy: {
        category: 'asc',
      },
    });

    const categories = categoryAggregation.map((item) => ({
      name: item.category,
      count: item._count.category,
    }));

    // Get price range using aggregate based on product type
    let minPrice = 0;
    let maxPrice = 10000;

    if (productType === "rental") {
      const priceAggregation = await prisma.product.aggregate({
        where: whereClause,
        _min: {
          rentalPrice: true,
        },
        _max: {
          rentalPrice: true,
        },
      });
      minPrice = priceAggregation._min.rentalPrice || 0;
      maxPrice = priceAggregation._max.rentalPrice || 10000;
    } else if (productType === "purchase") {
      const priceAggregation = await prisma.product.aggregate({
        where: whereClause,
        _min: {
          purchasePrice: true,
        },
        _max: {
          purchasePrice: true,
        },
      });
      minPrice = priceAggregation._min.purchasePrice || 0;
      maxPrice = priceAggregation._max.purchasePrice || 10000;
    } else {
      // For "all" type, get the range across both rental and purchase prices
      const rentalAggregation = await prisma.product.aggregate({
        where: whereClause,
        _min: {
          rentalPrice: true,
        },
        _max: {
          rentalPrice: true,
        },
      });
      const purchaseAggregation = await prisma.product.aggregate({
        where: whereClause,
        _min: {
          purchasePrice: true,
        },
        _max: {
          purchasePrice: true,
        },
      });
      minPrice = Math.min(
        rentalAggregation._min.rentalPrice || 0,
        purchaseAggregation._min.purchasePrice || 0
      );
      maxPrice = Math.max(
        rentalAggregation._max.rentalPrice || 10000,
        purchaseAggregation._max.purchasePrice || 10000
      );
    }

    return NextResponse.json({
      categories,
      priceRange: {
        min: Math.floor(minPrice),
        max: Math.ceil(maxPrice),
      },
    });
  } catch (error) {
    console.error("Error fetching filters:", error);
    return NextResponse.json(
      { error: "Failed to fetch filters" },
      { status: 500 }
    );
  }
}
