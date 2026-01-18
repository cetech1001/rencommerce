"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface PaymentData {
  orderID: string;
  paymentMethod: "CARD" | "BANK_TRANSFER" | "CRYPTO";
  paymentInfo: Record<string, any>;
}

export async function processPayment(data: PaymentData) {
  try {
    const { orderID, paymentMethod, paymentInfo } = data;

    // Validate order exists and is in PENDING state
    const order = await prisma.order.findUnique({
      where: { id: orderID },
      include: { orderItems: true },
    });

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    if (order.status !== "PENDING") {
      return {
        success: false,
        error: "Order has already been processed",
      };
    }

    // Verify stock availability one more time before processing
    for (const item of order.orderItems) {
      const product = await prisma.product.findUnique({
        where: { id: item.productID },
        select: { quantity: true, isActive: true },
      });

      if (!product || !product.isActive) {
        return {
          success: false,
          error: "One or more products are no longer available",
        };
      }

      if (item.quantity > product.quantity) {
        return {
          success: false,
          error: "Insufficient stock for one or more items",
        };
      }
    }

    // Create transaction record
    const transaction = await prisma.transaction.create({
      data: {
        orderID,
        amount: order.totalAmount,
        status: "COMPLETED", // In real app, this would be PENDING until confirmed
        paymentMethod,
        paymentInfo: paymentInfo || {},
      },
    });

    // Update order status
    await prisma.order.update({
      where: { id: orderID },
      data: { status: "PROCESSING" },
    });

    // Decrease product stock
    for (const item of order.orderItems) {
      await prisma.product.update({
        where: { id: item.productID },
        data: {
          quantity: {
            decrement: item.quantity,
          },
        },
      });
    }

    // Revalidate relevant paths
    revalidatePath("/products");
    revalidatePath(`/product/${order.orderItems[0]?.productID}`);

    return {
      success: true,
      transactionID: transaction.id,
      message: "Payment processed successfully",
    };
  } catch (error) {
    console.error("Payment processing error:", error);
    return { success: false, error: "Failed to process payment" };
  }
}
