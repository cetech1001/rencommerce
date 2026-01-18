import type { TransactionStatus as PrismaTransactionStatus } from "@prisma/client";

export type TransactionStatus = PrismaTransactionStatus;

export interface TransactionListItem {
  id: string;
  orderId: string;
  userId: string;
  userName: string;
  amount: number;
  status: TransactionStatus;
  paymentMethod: string;
  transactionDate: string;
}
