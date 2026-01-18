"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Package, ArrowRight } from "lucide-react";

export default function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get("orderId");
    setOrderId(id);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 py-12 sm:py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-xl border border-border p-8 sm:p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Order Confirmed!
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Thank you for your order. We've received your payment and will process your order shortly.
          </p>

          {orderId && (
            <div className="bg-muted rounded-lg p-4 mb-8">
              <p className="text-sm text-muted-foreground mb-1">Order ID</p>
              <p className="font-mono font-semibold text-foreground">{orderId}</p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">What's Next?</h2>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>You will receive an order confirmation email shortly</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>We will notify you when your order is being prepared</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Track your order status from your account dashboard</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Rental items must be returned by the end date specified</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/products"
              className="flex-1 py-3 px-6 rounded-lg border-2 border-primary text-primary font-medium hover:bg-primary hover:text-white transition-all duration-200 text-center"
            >
              Continue Shopping
            </Link>
            <Link
              href="/orders"
              className="flex-1 py-3 px-6 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-all duration-200 text-center flex items-center justify-center gap-2"
            >
              View Orders
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
