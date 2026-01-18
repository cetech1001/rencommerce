"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/actions/auth";

export async function getAllTransactions() {
  await requireAdmin();

  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        order: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform data to match the frontend interface
    return transactions.map((transaction) => ({
      id: transaction.id,
      orderId: transaction.orderID,
      userId: transaction.order.userID,
      userName: transaction.order.user.name,
      amount: transaction.amount,
      status: transaction.status,
      paymentMethod: transaction.paymentMethod,
      transactionDate: transaction.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}
