import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;
    const body = await request.json();
    const { paymentMethod, paymentInfo } = body;

    // Validate order exists and is in PENDING state
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status !== "PENDING") {
      return NextResponse.json(
        { error: "Order has already been processed" },
        { status: 400 }
      );
    }

    // Verify stock availability one more time before processing
    for (const item of order.orderItems) {
      const product = await prisma.product.findUnique({
        where: { id: item.productID },
        select: { quantity: true, isActive: true },
      });

      if (!product || !product.isActive) {
        return NextResponse.json(
          { error: "One or more products are no longer available" },
          { status: 400 }
        );
      }

      if (item.quantity > product.quantity) {
        return NextResponse.json(
          { error: "Insufficient stock for one or more items" },
          { status: 400 }
        );
      }
    }

    // Create transaction record
    const transaction = await prisma.transaction.create({
      data: {
        orderID: orderId,
        amount: order.totalAmount,
        status: "COMPLETED", // In real app, this would be PENDING until confirmed
        paymentMethod: paymentMethod,
        paymentInfo: paymentInfo || {},
      },
    });

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
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

    return NextResponse.json({
      success: true,
      transactionId: transaction.id,
      message: "Payment processed successfully",
    });
  } catch (error) {
    console.error("Payment processing error:", error);
    return NextResponse.json(
      { error: "Failed to process payment" },
      { status: 500 }
    );
  }
}
