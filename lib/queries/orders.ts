"use server";

import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/actions/auth";
import { requireAdmin } from "@/lib/actions/auth";
import type { OrderDetail, OrderListItem, PaginatedResponse } from "@/lib/types";

export interface OrderQueryOptions {
  page?: number;
  limit?: number;
  orderBy?: "createdAt" | "totalAmount";
  sortOrder?: "asc" | "desc";
  userId?: string; // If provided, fetch only this user's orders
  isAdmin?: boolean; // If true, fetch all orders (admin view)
}

export async function getOrders(
  options: OrderQueryOptions = {}
): Promise<PaginatedResponse<OrderListItem>> {
  const {
    page = 1,
    limit = 10,
    orderBy = "createdAt",
    sortOrder = "desc",
    userId,
    isAdmin = false,
  } = options;

  // Check authorization
  if (isAdmin) {
    await requireAdmin();
  } else if (!userId) {
    const session = await getAuthSession();
    if (!session.user) {
      return {
        data: [],
        meta: {
          page,
          itemsCount: 0,
          totalPages: 0,
          totalCount: 0,
        },
      };
    }
  }

  try {
    const where = userId ? { userID: userId } : {};

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        [orderBy]: sortOrder,
      },
      skip: limit * (page - 1),
      take: limit,
    });

    const ordersCount = await prisma.order.count({ where });

    const formattedOrders: OrderListItem[] = orders.map((order) => ({
      id: order.id,
      userId: order.userID,
      userName: order.user.name,
      totalAmount: order.totalAmount,
      status: order.status,
      type: order.type,
      createdAt: order.createdAt.toISOString(),
    }));

    return {
      data: formattedOrders,
      meta: {
        page,
        itemsCount: formattedOrders.length,
        totalPages: Math.ceil(ordersCount / limit),
        totalCount: ordersCount,
      },
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return {
      data: [],
      meta: {
        page,
        itemsCount: 0,
        totalPages: 0,
        totalCount: 0,
      },
    };
  }
}

// Public queries
export async function getOrderByID(orderID: string): Promise<OrderDetail | null> {
  const order = await prisma.order.findUnique({
    where: { id: orderID },
    include: {
      orderItems: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
      billingAddress: true,
      shippingAddress: true,
      transactions: {
        select: {
          id: true,
          status: true,
          paymentMethod: true,
          amount: true,
          createdAt: true,
        },
      },
    },
  });

  if (!order) {
    return null;
  }

  const formattedOrder: OrderDetail = {
    id: order.id,
    totalAmount: order.totalAmount,
    shippingFee: order.shippingFee,
    discountFee: order.discountFee,
    taxFee: order.taxFee,
    status: order.status,
    type: order.type,
    createdAt: order.createdAt.toISOString(),
    orderItems: order.orderItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      price: item.price,
      type: item.type,
      rentalStartDate: item.rentalStartDate?.toISOString() || null,
      rentalEndDate: item.rentalEndDate?.toISOString() || null,
      product: {
        id: item.product.id,
        name: item.product.name,
        image: item.product.image,
      },
    })),
    transactions: order.transactions.map((transaction) => ({
      id: transaction.id,
      status: transaction.status,
      paymentMethod: transaction.paymentMethod,
      amount: transaction.amount,
      createdAt: transaction.createdAt.toISOString(),
    })),
  };

  return formattedOrder;
}
