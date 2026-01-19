"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { XCircle, CreditCard, ArrowLeft, Copy, Check } from "lucide-react";
import { getOrderByID } from "@/lib/queries";
import type { OrderDetail } from "@/lib/types";

export default function PaymentDeclinedPage() {
  const params = useParams();
  const orderID = params.orderID as string;
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (orderID) {
      fetchOrder();
    }
  }, [orderID]);

  const fetchOrder = async () => {
    try {
      const orderData = await getOrderByID(orderID);
      setOrder(orderData);
    } catch (error) {
      console.error("Failed to fetch order:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    const paymentLink = `${window.location.origin}/payment/${orderID}`;
    navigator.clipboard.writeText(paymentLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const paymentLink = `${typeof window !== "undefined" ? window.location.origin : ""}/payment/${orderID}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 py-8 sm:py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>

        <div className="bg-white rounded-xl border border-border p-8 sm:p-12">
          {/* Declined Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Payment Declined</h1>
            <p className="text-muted-foreground">
              Your card payment was not successful. Please try a different payment method.
            </p>
          </div>

          {/* Order Info */}
          {order && (
            <div className="bg-muted/50 rounded-lg p-4 mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Order Number:</span>
                <span className="text-sm font-mono font-medium">{orderID}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Amount Due:</span>
                <span className="text-lg font-bold text-primary">${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Common Reasons */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-foreground mb-3">Common reasons for declined payments:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span>•</span>
                <span>Insufficient funds in your account</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Incorrect card information entered</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Card has expired or been reported lost/stolen</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Bank security measures or fraud prevention</span>
              </li>
            </ul>
          </div>

          {/* Payment Link */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-blue-900 mb-3">
              Your payment link (valid for 24 hours):
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs font-mono bg-white px-3 py-2 rounded border border-blue-300 overflow-auto">
                {paymentLink}
              </code>
              <button
                onClick={handleCopyLink}
                className="p-2 hover:bg-blue-100 rounded transition-colors flex-shrink-0"
                title="Copy link"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-blue-600" />
                )}
              </button>
            </div>
          </div>

          {/* Alternative Payment Methods */}
          <div className="space-y-3">
            <Link
              href={`/payment/${orderID}`}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-all duration-200"
            >
              <CreditCard className="w-5 h-5" />
              Try Another Payment Method
            </Link>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                We recommend trying:
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-xs">
                <span className="px-3 py-1 bg-muted rounded-full text-foreground">Bank Transfer</span>
                <span className="px-3 py-1 bg-muted rounded-full text-foreground">Cryptocurrency</span>
                <span className="px-3 py-1 bg-muted rounded-full text-foreground">Different Card</span>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Need help? Contact our support team at{" "}
              <a href="mailto:support@energyhub.com" className="text-primary hover:underline">
                support@energyhub.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
