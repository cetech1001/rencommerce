"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShoppingCart,
  Calendar,
  CheckCircle,
  AlertCircle,
  X,
  Tag,
} from "lucide-react";
import { useCart } from "@/lib/contexts";

interface AppliedCoupon {
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  scope: "ITEM" | "CART";
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getRentItems, getBuyItems, getTotalPrice, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAccountForm, setShowAccountForm] = useState(false);

  // Form state
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");

  // Account creation
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Rental-specific state (per-item)
  const [rentalDates, setRentalDates] = useState<Record<string, { startDate: string; endDate: string }>>({});
  const [rentalAgreement, setRentalAgreement] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const rentItems = getRentItems();
  const buyItems = getBuyItems();
  const hasRentals = rentItems.length > 0;
  const hasPurchases = buyItems.length > 0;

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }

    // Check authentication
    checkAuth();
  }, [items, router]);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/session");
      const data = await response.json();

      if (data.user && data.user.role === "CUSTOMER") {
        setIsAuthenticated(true);
        setEmail(data.user.email || "");
        setName(data.user.name || "");
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Failed to check auth:", error);
      setIsAuthenticated(false);
    }
  };

  const calculateRentalDays = (itemId: string) => {
    const dates = rentalDates[itemId];
    if (!dates?.startDate || !dates?.endDate) return 0;

    const start = new Date(dates.startDate);
    const end = new Date(dates.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      if (item.type === "rent") {
        const days = calculateRentalDays(item.id) || 1;
        return total + item.price * item.quantity * days;
      }
      return total + item.price * item.quantity;
    }, 0);
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;

    const subtotal = calculateSubtotal();

    if (appliedCoupon.scope === "CART") {
      if (appliedCoupon.discountType === "PERCENTAGE") {
        return (subtotal * appliedCoupon.discountValue) / 100;
      }
      return appliedCoupon.discountValue;
    }

    return 0; // Item-level discounts would be calculated differently
  };

  const subtotal = calculateSubtotal();
  const discount = calculateDiscount();
  const discountedTotal = subtotal - discount;
  const tax = discountedTotal * 0.1;
  const grandTotal = discountedTotal + tax;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    setErrors([]);

    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode,
          cartTotal: subtotal,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors([data.error || "Invalid coupon code"]);
        setCouponLoading(false);
        return;
      }

      setAppliedCoupon(data.coupon);
      setCouponCode("");
    } catch (error) {
      console.error("Coupon validation error:", error);
      setErrors(["Failed to apply coupon"]);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setErrors([]);
  };

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!email || !email.includes("@")) newErrors.push("Valid email is required");
    if (!name) newErrors.push("Name is required");
    if (!address) newErrors.push("Address is required");
    if (!city) newErrors.push("City is required");
    if (!postalCode) newErrors.push("Postal code is required");
    if (!phone) newErrors.push("Phone number is required");

    // Account creation validation
    if (!isAuthenticated && showAccountForm) {
      if (!password || password.length < 6) {
        newErrors.push("Password must be at least 6 characters");
      }
      if (password !== confirmPassword) {
        newErrors.push("Passwords do not match");
      }
    }

    // Rental validation
    if (hasRentals) {
      rentItems.forEach((item) => {
        const dates = rentalDates[item.id];
        if (!dates?.startDate) {
          newErrors.push(`${item.name}: Rental start date is required`);
        }
        if (!dates?.endDate) {
          newErrors.push(`${item.name}: Rental end date is required`);
        }
        if (dates?.startDate && dates?.endDate) {
          if (new Date(dates.startDate) >= new Date(dates.endDate)) {
            newErrors.push(`${item.name}: End date must be after start date`);
          }
        }
      });

      if (!rentalAgreement) {
        newErrors.push("You must agree to the rental terms");
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleCreateAccount = async () => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          password,
          role: "CUSTOMER",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors([data.error || "Failed to create account"]);
        return false;
      }

      // Auto-login after registration
      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (loginResponse.ok) {
        setIsAuthenticated(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Account creation error:", error);
      setErrors(["Failed to create account"]);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Create account if needed
    if (!isAuthenticated && showAccountForm) {
      const accountCreated = await handleCreateAccount();
      if (!accountCreated) {
        setLoading(false);
        return;
      }
    }

    try {
      // Prepare items with rental dates
      const orderItems = items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        type: item.type,
        ...(item.type === "rent" && rentalDates[item.id]
          ? {
              rentalStartDate: rentalDates[item.id].startDate,
              rentalEndDate: rentalDates[item.id].endDate,
            }
          : {}),
      }));

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: orderItems,
          customerInfo: {
            email,
            name,
            address,
            city,
            postalCode,
            phone,
          },
          couponCode: appliedCoupon?.code,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors([data.error || "Checkout failed"]);
        setLoading(false);
        return;
      }

      clearCart();
      router.push(`/checkout/success?orderId=${data.orderId}`);
    } catch (error) {
      console.error("Checkout error:", error);
      setErrors(["An error occurred during checkout. Please try again."]);
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 py-8 sm:py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-8">Checkout</h1>

        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-2">Please fix the following errors:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                  {errors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Authentication Status */}
            {!isAuthenticated && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Account</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Create an account to track your orders and speed up future checkouts.
                </p>
                <button
                  onClick={() => setShowAccountForm(!showAccountForm)}
                  className="text-primary font-medium hover:underline text-sm"
                >
                  {showAccountForm ? "Continue as guest" : "Create an account"}
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Account Creation Fields */}
              {!isAuthenticated && showAccountForm && (
                <div className="bg-white rounded-xl border border-border p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Create Account</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Password *
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Minimum 6 characters"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Re-enter password"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="bg-white rounded-xl border border-border p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isAuthenticated}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-muted"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-xl border border-border p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="123 Main St"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="10001"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Rental Details (Per-Item) */}
              {hasRentals && (
                <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold text-foreground">Rental Details</h2>
                  </div>

                  <div className="space-y-6">
                    {rentItems.map((item) => {
                      const days = calculateRentalDays(item.id);
                      return (
                        <div key={`${item.id}_${item.type}`} className="bg-white rounded-lg p-4 border border-blue-200">
                          <div className="flex items-start gap-3 mb-4">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={60}
                              height={60}
                              className="w-15 h-15 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground">{item.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                Qty: {item.quantity} × ${item.price.toFixed(2)}/day
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-foreground mb-2">
                                Start Date *
                              </label>
                              <input
                                type="date"
                                value={rentalDates[item.id]?.startDate || ""}
                                onChange={(e) =>
                                  setRentalDates((prev) => ({
                                    ...prev,
                                    [item.id]: {
                                      ...prev[item.id],
                                      startDate: e.target.value,
                                    },
                                  }))
                                }
                                min={new Date().toISOString().split("T")[0]}
                                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-foreground mb-2">
                                End Date *
                              </label>
                              <input
                                type="date"
                                value={rentalDates[item.id]?.endDate || ""}
                                onChange={(e) =>
                                  setRentalDates((prev) => ({
                                    ...prev,
                                    [item.id]: {
                                      ...prev[item.id],
                                      endDate: e.target.value,
                                    },
                                  }))
                                }
                                min={
                                  rentalDates[item.id]?.startDate ||
                                  new Date().toISOString().split("T")[0]
                                }
                                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                              />
                            </div>
                          </div>

                          {days > 0 && (
                            <div className="mt-3 p-3 bg-blue-100 rounded-lg">
                              <p className="text-sm text-foreground">
                                <span className="font-semibold">Rental Period:</span> {days}{" "}
                                {days === 1 ? "day" : "days"}
                              </p>
                              <p className="text-sm text-primary font-semibold mt-1">
                                Total: ${(item.price * item.quantity * days).toFixed(2)}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Rental Agreement */}
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <h3 className="font-semibold text-foreground mb-2">Rental Agreement</h3>
                      <div className="text-sm text-muted-foreground space-y-2 mb-4">
                        <p>By renting items from our store, you agree to:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>Return all rented items in the same condition as received</li>
                          <li>Be responsible for any damage or loss during the rental period</li>
                          <li>Return items by the end date or incur additional daily charges</li>
                          <li>Provide valid identification and payment information</li>
                          <li>Pay a security deposit which will be refunded upon item return</li>
                        </ul>
                      </div>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rentalAgreement}
                          onChange={(e) => setRentalAgreement(e.target.checked)}
                          className="mt-1 w-4 h-4 text-primary border-border rounded focus:ring-primary"
                        />
                        <span className="text-sm text-foreground">
                          I have read and agree to the rental terms and conditions *
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Complete Order
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary with Coupon */}
          <div className="lg:col-span-1 space-y-6">
            {/* Coupon Code */}
            <div className="bg-white rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Coupon Code
              </h3>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter code"
                  className="flex-1 px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  disabled={!!appliedCoupon}
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={couponLoading || !!appliedCoupon || !couponCode.trim()}
                  className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {couponLoading ? "..." : "Apply"}
                </button>
              </div>

              {/* Applied Coupon Banner */}
              {appliedCoupon && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <div className="flex-1 text-sm">
                    <p className="font-semibold text-green-900">
                      Coupon "{appliedCoupon.code}" applied!
                    </p>
                    <p className="text-green-700">
                      {appliedCoupon.discountType === "PERCENTAGE"
                        ? `${appliedCoupon.discountValue}% off`
                        : `$${appliedCoupon.discountValue.toFixed(2)} off`}
                    </p>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="p-1 hover:bg-green-100 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-green-600" />
                  </button>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl border border-border p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Order Summary</h3>

              {/* Purchase Items */}
              {hasPurchases && (
                <div className="mb-6 pb-6 border-b border-border">
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Purchase Items ({buyItems.length})
                  </h4>
                  <div className="space-y-3">
                    {buyItems.map((item) => (
                      <div key={`${item.id}_${item.type}`} className="flex gap-3">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rental Items */}
              {hasRentals && (
                <div className="mb-6 pb-6 border-b border-border">
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Rental Items ({rentItems.length})
                  </h4>
                  <div className="space-y-3">
                    {rentItems.map((item) => {
                      const days = calculateRentalDays(item.id);
                      return (
                        <div key={`${item.id}_${item.type}`} className="flex gap-3">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Qty: {item.quantity} × ${item.price.toFixed(2)}/day
                            </p>
                            {days > 0 && (
                              <p className="text-xs text-primary font-medium">
                                {days} {days === 1 ? "day" : "days"} rental
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
                </div>

                {appliedCoupon && discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount ({appliedCoupon.code})</span>
                    <span className="font-medium text-green-600">-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span className="font-medium text-foreground">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-xl font-bold text-primary">${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
