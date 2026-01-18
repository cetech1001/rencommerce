import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    // Get all active products with their categories
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        quantity: {
          gt: 0,
        },
      },
      select: {
        category: true,
      },
    });

    // Count products per category
    const categoryCounts: Record<string, number> = {};
    products.forEach((product) => {
      categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
    });

    // Convert to array and sort by name
    const categories = Object.entries(categoryCounts)
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
