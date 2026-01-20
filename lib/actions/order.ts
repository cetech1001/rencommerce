"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/actions/auth";
import { OrderStatus } from "@/lib/prisma/enums";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderID: string, newStatus: OrderStatus) {
  await requireAdmin();

  try {
    // Get the current order with items
    const currentOrder = await prisma.order.findUnique({
      where: { id: orderID },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!currentOrder) {
      return { success: false, error: "Order not found" };
    }

    const oldStatus = currentOrder.status;

    // Handle stock changes based on status transition
    if (oldStatus === OrderStatus.PENDING && newStatus === OrderStatus.PROCESSING) {
      // Decrease stock when order moves to processing
      for (const item of currentOrder.orderItems) {
        await prisma.product.update({
          where: { id: item.productID },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });
      }
    } else if (oldStatus === OrderStatus.PROCESSING && newStatus === OrderStatus.CANCELLED) {
      // Return stock when order is cancelled from processing
      for (const item of currentOrder.orderItems) {
        await prisma.product.update({
          where: { id: item.productID },
          data: {
            quantity: {
              increment: item.quantity,
            },
          },
        });
      }
    }

    // Update the order status
    await prisma.order.update({
      where: { id: orderID },
      data: { status: newStatus },
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderID}`);

    return { success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: "Failed to update order status" };
  }
}
