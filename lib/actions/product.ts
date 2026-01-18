"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "./auth";

interface CreateProductData {
  name: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  rentalPrice: number;
  purchasePrice: number;
  rentalSalePrice?: number | null;
  purchaseSalePrice?: number | null;
  quantity: number;
  image: string;
  additionalImages?: string[];
  features?: string[];
  specifications?: Record<string, string>;
}

export async function createProduct(data: CreateProductData) {
  await requireAdmin();

  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        shortDescription: data.shortDescription,
        longDescription: data.longDescription,
        category: data.category,
        rentalPrice: data.rentalPrice,
        purchasePrice: data.purchasePrice,
        rentalSalePrice: data.rentalSalePrice || null,
        purchaseSalePrice: data.purchaseSalePrice || null,
        quantity: data.quantity || 0,
        image: data.image,
        additionalImages: data.additionalImages || [],
        features: data.features || [],
        specifications: data.specifications || {},
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");

    return { success: true, product };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: "Failed to create product" };
  }
}

interface UpdateProductData {
  id: string;
  name?: string;
  shortDescription?: string;
  longDescription?: string;
  category?: string;
  rentalPrice?: number;
  purchasePrice?: number;
  rentalSalePrice?: number | null;
  purchaseSalePrice?: number | null;
  quantity?: number;
  image?: string;
  additionalImages?: string[];
  features?: string[];
  specifications?: Record<string, string>;
}

export async function updateProduct(data: UpdateProductData) {
  await requireAdmin();

  try {
    const { id, ...updateData } = data;

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath(`/product/${id}`);

    return { success: true, product };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: "Failed to update product" };
  }
}

export async function deleteProduct(productID: string) {
  await requireAdmin();

  try {
    await prisma.product.delete({
      where: { id: productID },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");

    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}
