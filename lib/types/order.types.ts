import type { OrderStatus as PrismaOrderStatus, OrderType as PrismaOrderType } from "../prisma/enums";

export type OrderStatus = PrismaOrderStatus;
export type OrderType = PrismaOrderType;

export interface OrderListItem {
  id: string;
  userId: string;
  userName: string;
  totalAmount: number;
  status: OrderStatus;
  type: OrderType;
  createdAt: string;
}

export interface OrderItemProduct {
  id: string;
  name: string;
  image: string;
}

export interface OrderItemDetail {
  id: string;
  quantity: number;
  price: number;
  type: OrderType;
  rentalStartDate?: string | null;
  rentalEndDate?: string | null;
  product: OrderItemProduct;
}

export interface OrderDetail {
  id: string;
  totalAmount: number;
  shippingFee: number;
  status: OrderStatus;
  type: OrderType;
  createdAt: string;
  orderItems: OrderItemDetail[];
}
