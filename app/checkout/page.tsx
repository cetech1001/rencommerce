"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  AlertCircle,
  Tag,
  Loader2,
} from "lucide-react";
import { useCart } from "@/lib/contexts";
import { getAuthSession } from "@/lib/actions/auth";
import { validateCoupon } from "@/lib/actions/coupons";
import { createOrder } from "@/lib/actions/checkout";
import type { AppliedCoupon } from "@/lib/types";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getRentItems } = useCart();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // User info
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Account creation
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Billing Address
  const [billingAddress1, setBillingAddress1] = useState("");
  const [billingAddress2, setBillingAddress2] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingState, setBillingState] = useState("");
  const [billingPostalCode, setBillingPostalCode] = useState("");
  const [billingCountry, setBillingCountry] = useState("United States");

  // Shipping Address
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [shippingAddress1, setShippingAddress1] = useState("");
  const [shippingAddress2, setShippingAddress2] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingState, setShippingState] = useState("");
  const [shippingPostalCode, setShippingPostalCode] = useState("");
  const [shippingCountry, setShippingCountry] = useState("United States");

  // Rental dates (per-item)
  const [rentalDates, setRentalDates] = useState<Record<string, { startDate: string; endDate: string }>>({});

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const rentItems = getRentItems();
  const hasRentals = rentItems.length > 0;

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
    checkAuth();
  }, [items, router]);

  const checkAuth = async () => {
    try {
      const session = await getAuthSession();

      if (session.user && session.user.role === "CUSTOMER") {
        setIsAuthenticated(true);
        setEmail(session.user.email || "");
        setName(session.user.name || "");
        setPhone(session.user.phone || "");
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Failed to check auth:", error);
      setIsAuthenticated(false);
    } finally {
      setCheckingAuth(false);
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
    return 0;
  };

  const subtotal = calculateSubtotal();
  const discount = calculateDiscount();
  const discountedTotal = subtotal - discount;
  const shippingFee = discountedTotal < 200 ? 5.99 : 0;
  const tax = discountedTotal * 0.1;
  const grandTotal = discountedTotal + tax + shippingFee;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    setErrors([]);

    const result = await validateCoupon({ code: couponCode, cartTotal: subtotal });

    if (result.success && result.coupon) {
      setAppliedCoupon(result.coupon);
      setCouponCode("");
    } else {
      setErrors([result.error || "Invalid coupon code"]);
    }

    setCouponLoading(false);
  };

  // This function is no longer needed - account creation is now handled in createOrder action

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!email) newErrors.push("Email is required");
    if (!name) newErrors.push("Name is required");
    if (!phone) newErrors.push("Phone is required");

    // Billing address
    if (!billingAddress1) newErrors.push("Billing address is required");
    if (!billingCity) newErrors.push("Billing city is required");
    if (!billingState) newErrors.push("Billing state is required");
    if (!billingPostalCode) newErrors.push("Billing postal code is required");
    if (!billingCountry) newErrors.push("Billing country is required");

    // Shipping address (if different)
    if (!sameAsBilling) {
      if (!shippingAddress1) newErrors.push("Shipping address is required");
      if (!shippingCity) newErrors.push("Shipping city is required");
      if (!shippingState) newErrors.push("Shipping state is required");
      if (!shippingPostalCode) newErrors.push("Shipping postal code is required");
      if (!shippingCountry) newErrors.push("Shipping country is required");
    }

    // Account creation validation
    if (!isAuthenticated) {
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
        if (!dates || !dates.startDate || !dates.endDate) {
          newErrors.push(`Please select rental dates for ${item.name}`);
        }
      });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Prepare order data
    const orderData = {
      items: items.map((item) => ({
        productID: item.id,
        quantity: item.quantity,
        price: item.price,
        type: item.type.toUpperCase() as "RENT" | "PURCHASE",
        rentalStartDate: item.type === "rent" ? rentalDates[item.id]?.startDate : null,
        rentalEndDate: item.type === "rent" ? rentalDates[item.id]?.endDate : null,
      })),
      billingAddress: {
        addressLine1: billingAddress1,
        addressLine2: billingAddress2,
        city: billingCity,
        state: billingState,
        postalCode: billingPostalCode,
        country: billingCountry,
      },
      shippingAddress: {
        addressLine1: sameAsBilling ? billingAddress1 : shippingAddress1,
        addressLine2: sameAsBilling ? billingAddress2 : shippingAddress2,
        city: sameAsBilling ? billingCity : shippingCity,
        state: sameAsBilling ? billingState : shippingState,
        postalCode: sameAsBilling ? billingPostalCode : shippingPostalCode,
        country: sameAsBilling ? billingCountry : shippingCountry,
      },
      sameAsBilling,
      totalAmount: grandTotal,
      shippingFee,
      discountFee: discount,
      taxFee: tax,
      couponCode: appliedCoupon?.code,
      accountData: !isAuthenticated
        ? {
            email,
            name,
            phone,
            password,
          }
        : undefined,
    };

    const result = await createOrder(orderData);

    if (result.success && result.orderID) {
      // Redirect to payment page
      router.push(`/payment/${result.orderID}`);
    } else {
      setErrors(result.details || [result.error || "Failed to create order"]);
      setLoading(false);
    }
  };

  if (items.length === 0 || checkingAuth) {
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

        {/* Error Display */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-2">Please fix the following errors:</h3>
                <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
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
            {/* Account Creation */}
            {!isAuthenticated && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Create Account</h2>
                <p className="text-sm text-muted-foreground">
                  An account is required to complete your order and track your purchases.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Account Creation Fields */}
              {!isAuthenticated && (
                <div className="bg-white rounded-xl border border-border p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Account Information</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Password *
                        </label>
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Confirm Password *
                        </label>
                        <input
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Billing Address */}
              <div className="bg-white rounded-xl border border-border p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Billing Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      required
                      value={billingAddress1}
                      onChange={(e) => setBillingAddress1(e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Street address, P.O. box"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      value={billingAddress2}
                      onChange={(e) => setBillingAddress2(e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Apartment, suite, unit, building, floor, etc."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={billingCity}
                        onChange={(e) => setBillingCity(e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        value={billingState}
                        onChange={(e) => setBillingState(e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={billingPostalCode}
                        onChange={(e) => setBillingPostalCode(e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      required
                      value={billingCountry}
                      onChange={(e) => setBillingCountry(e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-xl border border-border p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Shipping Address</h2>

                <div className="mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sameAsBilling}
                      onChange={(e) => setSameAsBilling(e.target.checked)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-foreground">
                      Same as billing address
                    </span>
                  </label>
                </div>

                {!sameAsBilling && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Address Line 1 *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingAddress1}
                        onChange={(e) => setShippingAddress1(e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Street address, P.O. box"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        value={shippingAddress2}
                        onChange={(e) => setShippingAddress2(e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Apartment, suite, unit, building, floor, etc."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingCity}
                          onChange={(e) => setShippingCity(e.target.value)}
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingState}
                          onChange={(e) => setShippingState(e.target.value)}
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Postal Code *
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingPostalCode}
                          onChange={(e) => setShippingPostalCode(e.target.value)}
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Country *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingCountry}
                        onChange={(e) => setShippingCountry(e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Rental Dates */}
              {hasRentals && (
                <div className="bg-white rounded-xl border border-border p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Rental Periods</h2>
                  <div className="space-y-6">
                    {rentItems.map((item) => (
                      <div key={item.id} className="border-b border-border pb-4 last:border-b-0 last:pb-0">
                        <h3 className="font-medium text-foreground mb-3">{item.name}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Start Date *
                            </label>
                            <input
                              type="date"
                              required
                              value={rentalDates[item.id]?.startDate || ""}
                              onChange={(e) =>
                                setRentalDates({
                                  ...rentalDates,
                                  [item.id]: { ...rentalDates[item.id], startDate: e.target.value },
                                })
                              }
                              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              End Date *
                            </label>
                            <input
                              type="date"
                              required
                              value={rentalDates[item.id]?.endDate || ""}
                              onChange={(e) =>
                                setRentalDates({
                                  ...rentalDates,
                                  [item.id]: { ...rentalDates[item.id], endDate: e.target.value },
                                })
                              }
                              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                        </div>
                        {rentalDates[item.id]?.startDate && rentalDates[item.id]?.endDate && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Duration: {calculateRentalDays(item.id)} day(s)
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Continue to Payment"
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-border p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Order Summary</h3>

              {/* Items */}
              <div className="space-y-3 mb-6 pb-6 border-b border-border max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item.id}_${item.type}`} className="flex gap-3">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="w-15 h-15 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                        {item.type === "rent" && rentalDates[item.id]?.startDate && rentalDates[item.id]?.endDate
                          ? ` × ${calculateRentalDays(item.id)} days`
                          : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="mb-6 pb-6 border-b border-border">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon code"
                    disabled={!!appliedCoupon}
                    className="flex-1 px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !!appliedCoupon || !couponCode.trim()}
                    className="px-4 py-2 text-sm font-medium bg-muted hover:bg-muted/80 rounded-lg disabled:opacity-50"
                  >
                    {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                  </button>
                </div>
                {appliedCoupon && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                    <Tag className="w-4 h-4" />
                    <span>Coupon &quot;{appliedCoupon.code}&quot; applied</span>
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="font-medium text-green-600">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span className="font-medium text-foreground">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  {shippingFee > 0 ? (
                    <span className="font-medium text-foreground">${shippingFee.toFixed(2)}</span>
                  ) : (
                    <span className="font-medium text-green-600">Free</span>
                  )}
                </div>
              </div>

              <div className="flex justify-between mb-4">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-xl font-bold text-primary">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
