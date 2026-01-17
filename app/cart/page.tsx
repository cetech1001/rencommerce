"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function Cart() {
  const { items, removeFromCart, updateQuantity, getTotalPrice, getRentItems, getBuyItems, clearCart } =
    useCart();

  const rentItems = getRentItems();
  const buyItems = getBuyItems();
  const totalPrice = getTotalPrice();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>

          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-40" />
            <h1 className="text-3xl font-bold text-foreground mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              Start shopping to add items to your cart
            </p>
            <Link
              href="/products"
              className="inline-block px-8 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-all duration-200"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">
                Items ({items.length})
              </h2>

              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-6 border-b border-border last:border-b-0 last:pb-0">
                    {/* Product Image */}
                    <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{item.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.type === "rent" ? "Rental" : "Purchase"}
                          </p>
                          <p className="text-sm font-medium text-primary mt-2">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, Math.max(1, item.quantity - 1))
                            }
                            className="p-1 hover:bg-white rounded transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-3 font-medium text-sm">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-1 hover:bg-white rounded transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Checkout Options */}
          <div className="lg:col-span-1">
            {/* Order Summary */}
            <div className="bg-white rounded-xl border border-border p-6 mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-foreground">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium text-foreground">
                    ${(totalPrice * 0.1).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-foreground">Free</span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-xl font-bold text-primary">
                  ${(totalPrice * 1.1).toFixed(2)}
                </span>
              </div>

              <div className="space-y-3">
                {buyItems.length > 0 && (
                  <Link
                    href="/checkout/purchase"
                    className="w-full py-3 px-4 rounded-lg bg-secondary text-white font-medium hover:bg-secondary/90 transition-all duration-200 text-center block"
                  >
                    Checkout Purchase ({buyItems.length})
                  </Link>
                )}

                {rentItems.length > 0 && (
                  <Link
                    href="/checkout/rental"
                    className="w-full py-3 px-4 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-all duration-200 text-center block"
                  >
                    Checkout Rental ({rentItems.length})
                  </Link>
                )}

                {buyItems.length > 0 && rentItems.length > 0 && (
                  <div className="text-xs text-muted-foreground text-center pt-2">
                    💡 Tip: Checkout separately for purchase and rental items
                  </div>
                )}
              </div>
            </div>

            {/* Clear Cart */}
            <button
              onClick={() => {
                if (confirm("Are you sure you want to clear your cart?")) {
                  clearCart();
                }
              }}
              className="w-full py-2 px-4 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
