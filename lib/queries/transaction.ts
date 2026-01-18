"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/actions/auth";
import type { TransactionListItem } from "@/lib/types";

export async function getAllTransactions(): Promise<TransactionListItem[]> {
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

    const formattedTransactions: TransactionListItem[] = transactions.map((transaction) => ({
      id: transaction.id,
      orderId: transaction.orderID,
      userId: transaction.order.userID,
      userName: transaction.order.user.name,
      amount: transaction.amount,
      status: transaction.status,
      paymentMethod: transaction.paymentMethod,
      transactionDate: transaction.createdAt.toISOString(),
    }));

    return formattedTransactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}
