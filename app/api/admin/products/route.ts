import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Verify admin session
    const token = request.cookies.get("session")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await verifySession(token);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch all products
    const products = await prisma.product.findMany({
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

export async function POST(request: NextRequest) {
  try {
    // Verify admin session
    const token = request.cookies.get("session")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await verifySession(token);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      shortDescription,
      longDescription,
      category,
      rentalPrice,
      purchasePrice,
      rentalSalePrice,
      purchaseSalePrice,
      quantity,
      image,
      additionalImages,
      features,
      specifications,
    } = body;

    // Validate required fields
    if (!name || !shortDescription || !longDescription || !category || !image) {
      return NextResponse.json(
        { error: "All required fields must be filled" },
        { status: 400 }
      );
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        shortDescription,
        longDescription,
        category,
        rentalPrice: parseFloat(rentalPrice),
        purchasePrice: parseFloat(purchasePrice),
        rentalSalePrice: rentalSalePrice ? parseFloat(rentalSalePrice) : null,
        purchaseSalePrice: purchaseSalePrice ? parseFloat(purchaseSalePrice) : null,
        quantity: parseInt(quantity) || 0,
        image,
        additionalImages: additionalImages || [],
        features: features || [],
        specifications: specifications || {},
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
