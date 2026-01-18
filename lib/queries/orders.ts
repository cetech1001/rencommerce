"use server";

import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/actions/auth";
import { requireAdmin } from "@/lib/actions/auth";
import type { OrderDetail, OrderListItem } from "@/lib/types";

export async function getAllOrders(): Promise<OrderListItem[]> {
  await requireAdmin();

  try {
    const orders = await prisma.order.findMany({
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
    });

    const formattedOrders: OrderListItem[] = orders.map((order) => ({
      id: order.id,
      userId: order.userID,
      userName: order.user.name,
      totalAmount: order.totalAmount,
      status: order.status,
      type: order.type,
      createdAt: order.createdAt.toISOString(),
    }));

    return formattedOrders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
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
    },
  });

  if (!order) {
    return null;
  }

  const formattedOrder: OrderDetail = {
    id: order.id,
    totalAmount: order.totalAmount,
    shippingFee: order.shippingFee,
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
  };

  return formattedOrder;
}

export async function getUserOrders(): Promise<OrderDetail[]> {
  const session = await getAuthSession();

  if (!session.user) {
    return [];
  }

  const orders = await prisma.order.findMany({
    where: { userID: session.user.id },
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
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders: OrderDetail[] = orders.map((order) => ({
    id: order.id,
    totalAmount: order.totalAmount,
    shippingFee: order.shippingFee,
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
  }));

  return formattedOrders;
}
