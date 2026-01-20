"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Package, Calendar, DollarSign, Loader2 } from "lucide-react";
import { getOrderByID } from "@/lib/queries/orders";
import type { OrderDetail } from "@/lib/types";
import { OrderStatus, OrderType } from "@/lib/prisma/enums";

export default function AdminOrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus | "">("");

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const data = await getOrderByID(orderId);
      setOrder(data);
      if (data) {
        setNewStatus(data.status);
      }
    } catch (error) {
      console.error("Failed to fetch order:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!order || !newStatus || newStatus === order.status) return;

    setUpdating(true);
    try {
      const { updateOrderStatus } = await import("@/lib/actions/order");
      const result = await updateOrderStatus(orderId, newStatus);

      if (result.success) {
        await fetchOrder();
        alert("Order status updated successfully");
      } else {
        alert(result.error || "Failed to update order status");
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert("Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "PROCESSING":
        return "bg-blue-100 text-blue-700";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-muted text-foreground";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Order not found</h2>
          <Link href="/admin/orders" className="text-primary hover:underline">
            Back to orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Order #{order.id.slice(0, 8)}
              </h1>
              <p className="text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
              <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
                {order.type}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Status Update Section */}
          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold mb-4">Update Order Status</h2>
            <div className="flex items-center gap-4">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value={OrderStatus.PENDING}>Pending</option>
                <option value={OrderStatus.PROCESSING}>Processing</option>
                <option value={OrderStatus.COMPLETED}>Completed</option>
                <option value={OrderStatus.CANCELLED}>Cancelled</option>
              </select>
              <button
                onClick={handleStatusUpdate}
                disabled={updating || !newStatus || newStatus === order.status}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? "Updating..." : "Update Status"}
              </button>
            </div>
            {order.status === OrderStatus.PENDING && newStatus === OrderStatus.PROCESSING && (
              <p className="mt-2 text-sm text-yellow-600">
                ⚠️ Changing to Processing will decrease stock for all items
              </p>
            )}
            {order.status === OrderStatus.PROCESSING && newStatus === OrderStatus.CANCELLED && (
              <p className="mt-2 text-sm text-yellow-600">
                ⚠️ Changing to Cancelled will return items back to stock
              </p>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.type === OrderType.RENT ? "Rental" : "Purchase"} • Quantity: {item.quantity}
                    </p>
                    {item.type === OrderType.RENT && item.rentalStartDate && item.rentalEndDate && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(item.rentalStartDate).toLocaleDateString()} -{" "}
                        {new Date(item.rentalEndDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">${(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground mt-1">${item.price.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Package className="w-4 h-4" />
                  <span>Items ({order.orderItems.length})</span>
                </div>
                <span className="font-medium">
                  ${(order.totalAmount - order.shippingFee).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="w-4 h-4" />
                  <span>Shipping</span>
                </div>
                <span className="font-medium">
                  {order.shippingFee > 0 ? `$${order.shippingFee.toFixed(2)}` : "Free"}
                </span>
              </div>
              <div className="pt-3 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-xl font-bold text-primary">${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
