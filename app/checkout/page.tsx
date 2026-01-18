"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingCart, Calendar, CheckCircle, AlertCircle } from "lucide-react";
import { useCart } from "@/lib/contexts";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getRentItems, getBuyItems, getTotalPrice, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Form state
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");

  // Rental-specific state
  const [rentalStartDate, setRentalStartDate] = useState("");
  const [rentalEndDate, setRentalEndDate] = useState("");
  const [rentalAgreement, setRentalAgreement] = useState(false);

  const rentItems = getRentItems();
  const buyItems = getBuyItems();
  const totalPrice = getTotalPrice();
  const tax = totalPrice * 0.1;
  const grandTotal = totalPrice + tax;

  const hasRentals = rentItems.length > 0;
  const hasPurchases = buyItems.length > 0;

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!email || !email.includes("@")) newErrors.push("Valid email is required");
    if (!name) newErrors.push("Name is required");
    if (!address) newErrors.push("Address is required");
    if (!city) newErrors.push("City is required");
    if (!postalCode) newErrors.push("Postal code is required");
    if (!phone) newErrors.push("Phone number is required");

    if (hasRentals) {
      if (!rentalStartDate) newErrors.push("Rental start date is required");
      if (!rentalEndDate) newErrors.push("Rental end date is required");
      if (rentalStartDate && rentalEndDate && new Date(rentalStartDate) >= new Date(rentalEndDate)) {
        newErrors.push("Rental end date must be after start date");
      }
      if (!rentalAgreement) newErrors.push("You must agree to the rental terms");
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

    try {
      // Call checkout API to verify quantities
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            type: item.type,
          })),
          customerInfo: {
            email,
            name,
            address,
            city,
            postalCode,
            phone,
          },
          rentalDetails: hasRentals ? {
            startDate: rentalStartDate,
            endDate: rentalEndDate,
          } : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors([data.error || "Checkout failed"]);
        setLoading(false);
        return;
      }

      // Clear cart and redirect to success page
      clearCart();
      router.push(`/checkout/success?orderId=${data.orderId}`);
    } catch (error) {
      console.error("Checkout error:", error);
      setErrors(["An error occurred during checkout. Please try again."]);
      setLoading(false);
    }
  };

  const calculateRentalDays = () => {
    if (!rentalStartDate || !rentalEndDate) return 0;
    const start = new Date(rentalStartDate);
    const end = new Date(rentalEndDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const rentalDays = calculateRentalDays();

  if (items.length === 0) {
    return null; // Will redirect in useEffect
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
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                      className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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

              {/* Rental Details Section (only if there are rental items) */}
              {hasRentals && (
                <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold text-foreground">Rental Details</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Rental Start Date *
                        </label>
                        <input
                          type="date"
                          value={rentalStartDate}
                          onChange={(e) => setRentalStartDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Rental End Date *
                        </label>
                        <input
                          type="date"
                          value={rentalEndDate}
                          onChange={(e) => setRentalEndDate(e.target.value)}
                          min={rentalStartDate || new Date().toISOString().split("T")[0]}
                          className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>

                    {rentalDays > 0 && (
                      <div className="bg-white rounded-lg p-4 border border-blue-200">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold text-foreground">Rental Period:</span>{" "}
                          {rentalDays} {rentalDays === 1 ? "day" : "days"}
                        </p>
                      </div>
                    )}

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

          {/* Order Summary */}
          <div className="lg:col-span-1">
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
                    {rentItems.map((item) => (
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
                          {rentalDays > 0 && (
                            <p className="text-xs text-primary font-medium">
                              {rentalDays} {rentalDays === 1 ? "day" : "days"} rental
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-foreground">${totalPrice.toFixed(2)}</span>
                </div>
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
                  <span className="text-xl font-bold text-primary">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
                {hasRentals && rentalDays > 0 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    * Rental prices calculated for {rentalDays} {rentalDays === 1 ? "day" : "days"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
