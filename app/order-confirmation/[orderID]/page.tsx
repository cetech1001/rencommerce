"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle, Package, Loader2, ArrowRight } from "lucide-react";
import { getOrderByID } from "@/lib/queries/orders";
import type { OrderDetail } from "@/lib/types";
import { OrderStatus } from "@prisma/client";

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderID = params.orderID as string;
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderID) {
      fetchOrder();
    }
  }, [orderID]);

  const fetchOrder = async () => {
    try {
      const orderData = await getOrderByID(orderID);

      if (orderData) {
        setOrder(orderData);
      }
    } catch (err) {
      console.error("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = order
    ? order.totalAmount - order.shippingFee - order.taxFee + order.discountFee
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-2xl border border-border p-8 sm:p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Order Confirmed!
          </h1>

          <p className="text-lg text-muted-foreground mb-8">
            Thank you for your purchase. Your order has been successfully placed.
          </p>

          {order && (
            <div className="bg-muted/50 rounded-xl p-6 mb-8 text-left">
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Order Details</h2>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Number:</span>
                  <span className="font-mono font-medium">{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Amount:</span>
                  <span className="font-semibold text-primary">${order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium text-green-600">{order.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
                </div>
                {order.discountFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount:</span>
                    <span className="font-medium text-green-600">-${order.discountFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax:</span>
                  <span className="font-medium text-foreground">${order.taxFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping:</span>
                  <span className="font-medium text-foreground">
                    {order.shippingFee > 0 ? `$${order.shippingFee.toFixed(2)}` : "Free"}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="font-semibold text-foreground mb-3">Items Ordered:</h3>
                <ul className="space-y-2">
                  {order.orderItems.map((item) => (
                    <li key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {"We've"} sent a confirmation email with your order details. You can track your order status
              in your account dashboard.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-all duration-200"
              >
                Continue Shopping
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href={order?.status === OrderStatus.PENDING ? `/payment/${order.id}` : "/"}
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary/10 transition-all duration-200"
              >
                {order?.status === OrderStatus.PENDING ? "Go to Payment" : "Back to Home"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
