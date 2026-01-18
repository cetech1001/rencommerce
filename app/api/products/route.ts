import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        quantity: {
          gt: 0,
        },
      },
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
