import type { TransactionStatus as PrismaTransactionStatus } from "../prisma/enums";

export type TransactionStatus = PrismaTransactionStatus;

export interface TransactionListItem {
  id: string;
  orderID: string;
  userID: string;
  userName: string;
  amount: number;
  status: TransactionStatus;
  paymentMethod: string;
  transactionDate: string;
}

export interface TransactionDetail {
  id: string;
  orderID: string;
  userID: string;
  userName: string;
  userEmail: string;
  amount: number;
  status: TransactionStatus;
  paymentMethod: string;
  paymentInfo: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}
