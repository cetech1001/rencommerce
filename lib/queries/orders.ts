"use server";

import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/actions/auth";

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
