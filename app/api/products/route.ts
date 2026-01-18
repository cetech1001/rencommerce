import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productType = searchParams.get("type") as "rental" | "purchase" | "all" || "all";
    const selectedCategories = searchParams.get("categories")?.split(",").filter(Boolean) || [];
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    // Build where clause
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

    // Apply category filter
    if (selectedCategories.length > 0) {
      whereClause.category = {
        in: selectedCategories,
      };
    }

    // Apply price range filter
    if (minPrice || maxPrice) {
      const min = minPrice ? parseFloat(minPrice) : 0;
      const max = maxPrice ? parseFloat(maxPrice) : 999999;

      if (productType === "rental") {
        whereClause.rentalPrice = {
          ...whereClause.rentalPrice,
          gte: min,
          lte: max,
        };
      } else if (productType === "purchase") {
        whereClause.purchasePrice = {
          ...whereClause.purchasePrice,
          gte: min,
          lte: max,
        };
      } else {
        // For "all", match if either rental or purchase price is in range
        whereClause.OR = [
          {
            rentalPrice: {
              gte: min,
              lte: max,
            },
          },
          {
            purchasePrice: {
              gte: min,
              lte: max,
            },
          },
        ];
      }
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        shortDescription: true,
        category: true,
        rentalPrice: true,
        purchasePrice: true,
        rentalSalePrice: true,
        purchaseSalePrice: true,
        image: true,
        quantity: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
