"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/actions/auth";
import type { ProductQueryOptions } from "@/lib/types";
import { ProductOrderByWithAggregationInput, ProductWhereInput } from "../prisma/models";

// Admin-only query to get all products
export async function getAllProducts() {
  await requireAdmin();

  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductByIDAdmin(productID: string) {
  await requireAdmin();

  try {
    const product = await prisma.product.findUnique({
      where: { id: productID },
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
      }
    });

    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

// Public queries
export async function getProducts(options?: ProductQueryOptions) {
  const {
    category,
    isActive = true,
    hasRentalPrice,
    hasPurchasePrice,
    limit,
    orderBy = "createdAt",
  } = options || {};

  const where: ProductWhereInput = { isActive, quantity: { gt: 0 } };

  if (category) where.category = category;
  if (hasRentalPrice !== undefined) {
    where.rentalPrice = hasRentalPrice ? { gt: 0 } : { equals: 0 };
  }
  if (hasPurchasePrice !== undefined) {
    where.purchasePrice = hasPurchasePrice ? { gt: 0 } : { equals: 0 };
  }

  const orderByClause: ProductOrderByWithAggregationInput =
    orderBy === "price"
      ? { purchasePrice: "asc" }
      : orderBy === "name"
      ? { name: "asc" }
      : { createdAt: "desc" };

  const products = await prisma.product.findMany({
    where,
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
    orderBy: orderByClause,
    take: limit,
  });

  return products;
}

export async function getProductByID(productID: string) {
  const product = await prisma.product.findUnique({
    where: { id: productID },
    include: {
      reviews: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return product;
}

export async function getFeaturedProducts(limit: number = 4) {
  return getProducts({ limit, orderBy: "createdAt" });
}

export async function getRentalProducts(limit?: number) {
  return getProducts({ hasRentalPrice: true, limit, orderBy: "price" });
}

export async function getPurchaseProducts(limit?: number) {
  return getProducts({ hasPurchasePrice: true, limit, orderBy: "price" });
}

export async function searchProducts(query: string) {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      quantity: { gt: 0 },
      OR: [
        { name: { search: query } },
        { shortDescription: { search: query } },
        { longDescription: { search: query } },
      ],
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
    take: 20,
  });

  return products;
}
