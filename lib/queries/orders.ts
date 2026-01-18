"use server";

import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/actions/auth";
import { requireAdmin } from "@/lib/actions/auth";

// Admin-only query
export async function getAllOrders() {
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

    // Transform data to match the frontend interface
    return orders.map((order) => ({
      id: order.id,
      userId: order.userID,
      userName: order.user.name,
      totalAmount: order.totalAmount,
      status: order.status,
      type: order.type,
      createdAt: order.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

// Public queries
export async function getOrderByID(orderID: string) {
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

  return order;
}

export async function getUserOrders() {
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

  return orders;
}
