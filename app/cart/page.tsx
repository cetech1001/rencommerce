"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, AlertCircle } from "lucide-react";
import { useCart } from "@/lib/contexts";
import { ConfirmModal } from "@/lib/components/client";

export default function Cart() {
  const router = useRouter();
  const { items, removeFromCart, updateQuantity, getTotalPrice, getRentItems, getBuyItems, clearCart } =
    useCart();

  const [productStocks, setProductStocks] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [stockErrors, setStockErrors] = useState<string[]>([]);
  const [showClearCartModal, setShowClearCartModal] = useState(false);

  const rentItems = getRentItems();
  const buyItems = getBuyItems();
  const totalPrice = getTotalPrice();

  // Fetch current stock for all items in cart
  useEffect(() => {
    const fetchProductStocks = async () => {
      try {
        const stockPromises = items.map(async (item) => {
          const response = await fetch(`/api/products/${item.id}`);
          const data = await response.json();
          return { id: item.id, quantity: data.product?.quantity || 0 };
        });

        const stocks = await Promise.all(stockPromises);
        const stockMap = stocks.reduce((acc, stock) => {
          acc[stock.id] = stock.quantity;
          return acc;
        }, {} as Record<string, number>);

        setProductStocks(stockMap);
      } catch (error) {
        console.error("Failed to fetch product stocks:", error);
      } finally {
        setLoading(false);
      }
    };

    if (items.length > 0) {
      fetchProductStocks();
    } else {
      setLoading(false);
    }
  }, [items.length]);

  // Validate stock before allowing checkout
  const validateStock = () => {
    const errors: string[] = [];

    items.forEach((item) => {
      const availableStock = productStocks[item.id] || 0;

      if (availableStock === 0) {
        errors.push(`${item.name} is out of stock`);
      } else if (item.quantity > availableStock) {
        errors.push(
          `${item.name}: Only ${availableStock} available (you have ${item.quantity} in cart)`
        );
      }
    });

    setStockErrors(errors);
    return errors.length === 0;
  };

  // Validate stock whenever stocks or items change
  useEffect(() => {
    if (!loading && Object.keys(productStocks).length > 0) {
      validateStock();
    }
  }, [productStocks, items, loading]);

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
                  <div
                    key={`${item.id}_${item.type}`}
                    className="flex gap-4 pb-6 border-b border-border last:border-b-0 last:pb-0"
                  >
                    {/* Product Image */}
                    <Link
                      href={`/product/${item.id}`}
                      className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted group"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <Link
                            href={`/product/${item.id}`}
                            className="hover:text-primary transition-colors"
                          >
                            <h3 className="font-semibold text-foreground">{item.name}</h3>
                          </Link>
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.type === "rent" ? "Rental (per day)" : "Purchase"}
                          </p>
                          <p className="text-sm font-medium text-primary mt-2">
                            ${item.price.toFixed(2)}
                            {item.type === "rent" && " / day"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Subtotal: ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.type, Math.max(1, item.quantity - 1))
                            }
                            className="p-1 hover:bg-white rounded transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-3 font-medium text-sm">{item.quantity}</span>
                          <button
                            onClick={() => {
                              const maxStock = productStocks[item.id] || 0;
                              if (item.quantity < maxStock) {
                                updateQuantity(item.id, item.type, item.quantity + 1);
                              }
                            }}
                            disabled={!productStocks[item.id] || item.quantity >= productStocks[item.id]}
                            className="p-1 hover:bg-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Stock warning */}
                      {productStocks[item.id] !== undefined && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {productStocks[item.id] === 0 ? (
                            <span className="text-red-600 font-medium">Out of stock</span>
                          ) : item.quantity >= productStocks[item.id] ? (
                            <span className="text-orange-600 font-medium">
                              Max available: {productStocks[item.id]}
                            </span>
                          ) : (
                            <span>{productStocks[item.id]} available</span>
                          )}
                        </p>
                      )}
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id, item.type)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove from cart"
                      aria-label="Remove from cart"
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
            <div className="bg-white rounded-xl border border-border p-6 mb-6 sticky top-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-foreground">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span className="font-medium text-foreground">
                    ${(totalPrice * 0.1).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-xl font-bold text-primary">
                  ${(totalPrice * 1.1).toFixed(2)}
                </span>
              </div>

              <div className="space-y-3">
                {/* Stock Errors */}
                {stockErrors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-red-900 mb-1">
                          Cannot proceed to checkout:
                        </p>
                        <ul className="text-xs text-red-700 space-y-1">
                          {stockErrors.map((error, idx) => (
                            <li key={idx}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    if (validateStock()) {
                      router.push("/checkout");
                    }
                  }}
                  disabled={stockErrors.length > 0}
                  className="w-full py-3 px-4 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-all duration-200 text-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
                >
                  Proceed to Checkout
                </button>

                {buyItems.length > 0 && rentItems.length > 0 && (
                  <div className="text-xs text-muted-foreground text-center pt-2">
                    💡 Your cart contains both purchase and rental items
                  </div>
                )}
              </div>
            </div>

            {/* Clear Cart */}
            <button
              onClick={() => setShowClearCartModal(true)}
              className="w-full py-2 px-4 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>

      {/* Clear Cart Confirmation Modal */}
      <ConfirmModal
        isOpen={showClearCartModal}
        onClose={() => setShowClearCartModal(false)}
        onConfirm={clearCart}
        title="Clear Shopping Cart?"
        message="Are you sure you want to remove all items from your cart? This action cannot be undone."
        confirmText="Clear Cart"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
