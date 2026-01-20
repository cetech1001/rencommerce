"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/actions/auth";
import type { TransactionListItem, TransactionDetail } from "@/lib/types";

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

export async function getTransactionByID(transactionID: string): Promise<TransactionDetail | null> {
  await requireAdmin();

  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionID },
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
    });

    if (!transaction) {
      return null;
    }

    return {
      id: transaction.id,
      orderId: transaction.orderID,
      userId: transaction.order.userID,
      userName: transaction.order.user.name,
      userEmail: transaction.order.user.email,
      amount: transaction.amount,
      status: transaction.status,
      paymentMethod: transaction.paymentMethod,
      paymentInfo: transaction.paymentInfo as Record<string, any>,
      createdAt: transaction.createdAt.toISOString(),
      updatedAt: transaction.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return null;
  }
}
