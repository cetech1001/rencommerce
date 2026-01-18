import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600; // Cache for 1 hour

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const selectedCategories = searchParams.get("categories")?.split(",").filter(Boolean) || [];
    const priceType = searchParams.get("priceType") as "rental" | "purchase" || "rental";

    // Build where clause based on filters
    const whereClause: any = {
      isActive: true,
      quantity: {
        gt: 0,
      },
    };

    // Apply category filter if categories are selected
    if (selectedCategories.length > 0) {
      whereClause.category = {
        in: selectedCategories,
      };
    }

    // Get categories with counts using groupBy
    const categoryAggregation = await prisma.product.groupBy({
      by: ['category'],
      where: {
        isActive: true,
        quantity: {
          gt: 0,
        },
      },
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

    // Get price range using aggregate
    const priceField = priceType === "rental" ? "rentalPrice" : "purchasePrice";

    const priceAggregation = await prisma.product.aggregate({
      where: whereClause,
      _min: {
        [priceField]: true,
      },
      _max: {
        [priceField]: true,
      },
    });

    const minPrice = priceAggregation._min[priceField] || 0;
    const maxPrice = priceAggregation._max[priceField] || 10000;

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
