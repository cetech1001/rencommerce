"use server";

import { prisma } from "@/lib/db";
import { PRODUCT_ORDER_BY, type IProduct, type ProductQueryOptions, type ProductCategory, type PriceRange, Product } from "@/lib/types";
import { ProductOrderByWithAggregationInput, ProductWhereInput } from "../prisma/models";
import { PRODUCT_CARD_MODE } from "../utils";
import { PaginatedResponse } from "../types/pagination.types";

function applySearchFilter(where: ProductWhereInput, search?: string) {
  if (!search) return;

  where.OR = [
    { name: { contains: search } },
    { shortDescription: { contains: search } },
    { category: { contains: search } },
  ];
}

export async function getProducts(options: ProductQueryOptions): Promise<PaginatedResponse<IProduct>> {
  const {
    page = 1,
    limit,
    search,
    categories,
    isActive = true,
    hasRentalPrice,
    hasPurchasePrice,
    isInStock,
    minPrice,
    maxPrice,
    orderBy = PRODUCT_ORDER_BY.CREATED_AT,
    sortOrder = 'desc',
  } = options || {};

  const where: ProductWhereInput = {};

  applySearchFilter(where, search);
  if (isActive !== undefined) {
    where.isActive = isActive;
  }
  if (categories && categories.length > 0) {
    where.category = { in: categories };
  };
  if (hasRentalPrice !== undefined) {
    if (hasRentalPrice) {
      if (!minPrice && !maxPrice) {
        where.rentalPrice = { gt: 0 };
      } else {
        where.rentalPrice = {
          gte: minPrice,
          lte: maxPrice,
        };
      }
    } else {
      where.rentalPrice = { equals: 0 };
    }
  }
  if (hasPurchasePrice !== undefined) {
    if (hasPurchasePrice) {
      if (!minPrice && !maxPrice) {
        where.purchasePrice = { gt: 0 };
      } else {
        where.purchasePrice = {
          gte: minPrice,
          lte: maxPrice,
        };
      }
    } else {
      where.purchasePrice = { equals: 0 };
    }
  }
  if (isInStock) {
    where.quantity = isInStock ? { gt: 0 } : { equals: 0 };
  }

  const orderByClause: ProductOrderByWithAggregationInput = {
    [orderBy]: sortOrder,
  };

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
      createdAt: true,
    },
    orderBy: orderByClause,
    skip: limit * (page - 1),
    take: limit,
  });

  const productsCount = await prisma.product.count({ where });
  const meta = {
    page,
    itemsCount: products.length,
    totalPages: Math.ceil(productsCount / limit),
    totalCount: productsCount,
  }

  return {
    data: products,
    meta,
  };
}

export async function getProductStock(productID: string): Promise<number> {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productID },
      select: { quantity: true },
    });

    return product?.quantity ?? 0;
  } catch (error) {
    console.error("Error fetching product stock:", error);
    return 0;
  }
}

export async function getProductByID(productID: string): Promise<Product | null> {
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

  if (product) {
    return {
      ...product,
      additionalImages: product?.additionalImages as string[],
      features: product?.features as string[],
      specifications: product?.specifications as Record<string, string>,
    };
  }
  
  return null;
}

export async function getCategories(type?: PRODUCT_CARD_MODE, search?: string): Promise<ProductCategory[]> {
  const where: ProductWhereInput = { isActive: true };

  if (type === PRODUCT_CARD_MODE.RENTAL) {
    where.rentalPrice = { gt: 0 };
    where.purchasePrice = { equals: 0 };
  } else if (type === PRODUCT_CARD_MODE.PURCHASE) {
    where.purchasePrice = { gt: 0 };
    where.rentalPrice = { equals: 0 };
  }

  applySearchFilter(where, search);

  const categories = await prisma.product.groupBy({
    by: ["category"],
    where,
    _count: {
      category: true,
    },
    orderBy: {
      category: "asc",
    },
  });

  return categories.map((result) => ({
    name: result.category,
    count: result._count.category,
  }));
}

export async function getPriceRange(
  type?: PRODUCT_CARD_MODE,
  categories?: string[],
  search?: string
): Promise<PriceRange> {
  const where: ProductWhereInput = { isActive: true };

  if (categories && categories.length > 0) {
    where.category = { in: categories };
  }

  if (type === PRODUCT_CARD_MODE.RENTAL) {
    where.rentalPrice = { gt: 0 };
    where.purchasePrice = { equals: 0 };
  } else if (type === PRODUCT_CARD_MODE.PURCHASE) {
    where.purchasePrice = { gt: 0 };
    where.rentalPrice = { equals: 0 };
  }

  applySearchFilter(where, search);

  const priceAggregates = await prisma.product.aggregate({
    where,
    _min: {
      rentalPrice: true,
      purchasePrice: true,
    },
    _max: {
      rentalPrice: true,
      purchasePrice: true,
    },
  });

  const includeRental = type !== PRODUCT_CARD_MODE.PURCHASE;
  const includePurchase = type !== PRODUCT_CARD_MODE.RENTAL;

  const minValues: number[] = [];
  const maxValues: number[] = [];

  if (includeRental && priceAggregates._min.rentalPrice !== null) {
    minValues.push(priceAggregates._min.rentalPrice);
  }
  if (includePurchase && priceAggregates._min.purchasePrice !== null) {
    minValues.push(priceAggregates._min.purchasePrice);
  }

  if (includeRental && priceAggregates._max.rentalPrice !== null) {
    maxValues.push(priceAggregates._max.rentalPrice);
  }
  if (includePurchase && priceAggregates._max.purchasePrice !== null) {
    maxValues.push(priceAggregates._max.purchasePrice);
  }

  const min = minValues.length ? Math.min(...minValues) : 0;
  const max = maxValues.length ? Math.max(...maxValues) : min;

  return {
    min,
    max: Math.max(max, min),
  };
}
