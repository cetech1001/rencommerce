import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Update product
    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(shortDescription && { shortDescription }),
        ...(longDescription && { longDescription }),
        ...(category && { category }),
        ...(rentalPrice !== undefined && { rentalPrice: parseFloat(rentalPrice) }),
        ...(purchasePrice !== undefined && {
          purchasePrice: parseFloat(purchasePrice),
        }),
        ...(rentalSalePrice !== undefined && {
          rentalSalePrice: rentalSalePrice ? parseFloat(rentalSalePrice) : null
        }),
        ...(purchaseSalePrice !== undefined && {
          purchaseSalePrice: purchaseSalePrice ? parseFloat(purchaseSalePrice) : null
        }),
        ...(quantity !== undefined && { quantity: parseInt(quantity) }),
        ...(image && { image }),
        ...(additionalImages && { additionalImages }),
        ...(features && { features }),
        ...(specifications && { specifications }),
      },
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Delete product
    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
