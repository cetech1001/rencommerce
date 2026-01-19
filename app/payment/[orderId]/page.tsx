"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Lock, Copy, Check, Zap, DollarSign, Bitcoin, Loader2, AlertCircle } from "lucide-react";
import { useCart } from "@/lib/contexts";
import {
  getOrderByID,
  getCryptoRates,
} from "@/lib/queries";
import { processPayment } from "@/lib/actions/payment";
import type { OrderDetail, PaymentFormState, CryptoRate } from "@/lib/types";
import { convertToCrypto } from "@/lib/utils";
import {
  detectCardType,
  formatCardNumber,
  formatExpiryDate,
  formatCVC,
  validateCardNumber,
  validateExpiryDate,
  validateCVC,
  validateCardholderName,
  type CardType,
} from "@/lib/utils/cardValidation";
import { OrderStatus, PaymentMethod, TransactionStatus } from "@/lib/prisma/enums";

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const orderID = params.orderID as string;
  const { clearCart } = useCart();

  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cryptoRates, setCryptoRates] = useState<CryptoRate | null>(null);
  const [cardType, setCardType] = useState<CardType>("unknown");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const cardNumberRef = useRef<HTMLInputElement>(null);
  const cardExpiryRef = useRef<HTMLInputElement>(null);
  const cardCVCRef = useRef<HTMLInputElement>(null);

  const [paymentState, setPaymentState] = useState<PaymentFormState>({
    method: "CARD",
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVC: "",
    selectedCrypto: "bitcoin",
  });

  useEffect(() => {
    if (orderID) {
      fetchOrder();
      fetchCryptoRates();
    }
  }, [orderID]);

  const fetchCryptoRates = async () => {
    try {
      const rates = await getCryptoRates();
      setCryptoRates(rates);
    } catch (err) {
      console.error("Failed to fetch crypto rates:", err);
    }
  };

  const fetchOrder = async () => {
    try {
      const orderData = await getOrderByID(orderID);

      if (orderData) {
        setOrder(orderData);
      } else {
        setError("Order not found");
      }
    } catch (err) {
      setError("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  const handleCardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPaymentState({ ...paymentState, cardName: value });

    // Clear error when user starts typing
    if (validationErrors.cardName) {
      setValidationErrors({ ...validationErrors, cardName: "" });
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const type = detectCardType(value);
    setCardType(type);

    const formatted = formatCardNumber(value, type);
    setPaymentState({ ...paymentState, cardNumber: formatted });

    // Clear error when user starts typing
    if (validationErrors.cardNumber) {
      setValidationErrors({ ...validationErrors, cardNumber: "" });
    }

    // Auto-advance to expiry when complete
    const cleaned = formatted.replace(/\s/g, "");
    const maxLength = type === "amex" ? 15 : 16;
    if (cleaned.length === maxLength && cardExpiryRef.current) {
      cardExpiryRef.current.focus();
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatExpiryDate(value);
    setPaymentState({ ...paymentState, cardExpiry: formatted });

    // Clear error when user starts typing
    if (validationErrors.cardExpiry) {
      setValidationErrors({ ...validationErrors, cardExpiry: "" });
    }

    // Auto-advance to CVC when complete
    const cleaned = formatted.replace(/\D/g, "");
    if (cleaned.length === 4 && cardCVCRef.current) {
      cardCVCRef.current.focus();
    }
  };

  const handleCVCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatCVC(value, cardType);
    setPaymentState({ ...paymentState, cardCVC: formatted });

    // Clear error when user starts typing
    if (validationErrors.cardCVC) {
      setValidationErrors({ ...validationErrors, cardCVC: "" });
    }
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const validateCardPayment = () => {
    const errors: Record<string, string> = {};

    // Validate cardholder name
    const nameValidation = validateCardholderName(paymentState.cardName);
    if (!nameValidation.isValid) {
      errors.cardName = nameValidation.message || "Invalid name";
    }

    // Validate card number
    const cardValidation = validateCardNumber(paymentState.cardNumber);
    if (!cardValidation.isValid) {
      errors.cardNumber = cardValidation.message || "Invalid card number";
    }

    // Validate expiry
    const expiryValidation = validateExpiryDate(paymentState.cardExpiry);
    if (!expiryValidation.isValid) {
      errors.cardExpiry = expiryValidation.message || "Invalid expiry date";
    }

    // Validate CVC
    const cvcValidation = validateCVC(paymentState.cardCVC, cardType);
    if (!cvcValidation.isValid) {
      errors.cardCVC = cvcValidation.message || "Invalid CVC";
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      setError("Please correct the errors in the form.");
      return false;
    }

    return true;
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate based on payment method
    if (paymentState.method === "CARD" && !validateCardPayment()) return;

    setIsProcessing(true);

    const orderStatus = paymentState.method === PaymentMethod.CARD ? OrderStatus.PENDING : OrderStatus.PROCESSING;
    const transactionStatus = paymentState.method === PaymentMethod.CARD ? TransactionStatus.FAILED : TransactionStatus.PENDING;

    // For other payment methods, process normally
    const result = await processPayment({
      orderID: orderID,
      paymentMethod: paymentState.method,
      paymentInfo: {
        ...(paymentState.method === PaymentMethod.CARD && { cardName: paymentState.cardName }),
        ...(paymentState.method === PaymentMethod.CARD && { cardNumber: paymentState.cardNumber }),
        ...(paymentState.method === PaymentMethod.CARD && { cardCVC: paymentState.cardCVC }),
        ...(paymentState.method === PaymentMethod.CARD && { cardExpiry: paymentState.cardExpiry }),
        ...(paymentState.method === PaymentMethod.CRYPTO && { selectedCrypto: paymentState.selectedCrypto }),
      },
    }, orderStatus, transactionStatus);

    // For card payments, always redirect to declined page (as per requirements)
    if (paymentState.method === "CARD") {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.push(`/payment-declined/${orderID}`);
      return;
    }

    if (result.success) {
      // Clear cart and redirect
      clearCart();
      router.push(`/order-confirmation/${orderID}`);
    } else {
      setError(result.error || "Payment failed");
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <p className="text-red-900 mb-4">{error}</p>
            <Link
              href="/cart"
              className="inline-block px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-all duration-200"
            >
              Return to Cart
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const subtotal = order.totalAmount - (order.totalAmount * 0.1) - order.shippingFee;
  const tax = order.totalAmount * 0.1;

  // Calculate crypto amount using real-time rates
  const cryptoAmount = cryptoRates
    ? convertToCrypto(
        order.totalAmount,
        paymentState.selectedCrypto === "bitcoin" ? cryptoRates.btc : cryptoRates.eth
      )
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 py-8 sm:py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-8">Payment</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-900">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <form onSubmit={handleSubmitPayment} className="lg:col-span-2">
            {/* Payment Method Tabs */}
            <div className="bg-white rounded-xl border border-border p-6 mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">Payment Method</h2>

              <div className="grid grid-cols-3 gap-3 mb-8">
                {(["CARD", "BANK_TRANSFER", "CRYPTO"] as PaymentMethod[]).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentState({ ...paymentState, method })}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                      paymentState.method === method
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {method === "CARD" && <DollarSign className="w-6 h-6" />}
                    {method === "BANK_TRANSFER" && <Zap className="w-6 h-6" />}
                    {method === "CRYPTO" && <Bitcoin className="w-6 h-6" />}
                    <span className="text-xs font-medium">
                      {method === "CARD" ? "Card" : method === "BANK_TRANSFER" ? "Bank" : "Crypto"}
                    </span>
                  </button>
                ))}
              </div>

              {/* Card Payment */}
              {paymentState.method === "CARD" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Cardholder Name *
                    </label>
                    <input
                      type="text"
                      name="cardName"
                      required
                      value={paymentState.cardName}
                      onChange={handleCardNameChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        validationErrors.cardName
                          ? "border-red-500 focus:ring-red-500"
                          : "border-border focus:ring-primary"
                      }`}
                      placeholder="John Doe"
                    />
                    {validationErrors.cardName && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                        <AlertCircle className="w-3 h-3" />
                        <span>{validationErrors.cardName}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Card Number *
                    </label>
                    <div className="relative">
                      <input
                        ref={cardNumberRef}
                        type="text"
                        name="cardNumber"
                        required
                        value={paymentState.cardNumber}
                        onChange={handleCardNumberChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 font-mono ${
                          validationErrors.cardNumber
                            ? "border-red-500 focus:ring-red-500"
                            : "border-border focus:ring-primary"
                        }`}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                      {cardType !== "unknown" && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <span className="text-xs font-semibold text-muted-foreground uppercase">
                            {cardType}
                          </span>
                        </div>
                      )}
                    </div>
                    {validationErrors.cardNumber && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                        <AlertCircle className="w-3 h-3" />
                        <span>{validationErrors.cardNumber}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Expiry Date *
                      </label>
                      <input
                        ref={cardExpiryRef}
                        type="text"
                        name="cardExpiry"
                        required
                        value={paymentState.cardExpiry}
                        onChange={handleExpiryChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                          validationErrors.cardExpiry
                            ? "border-red-500 focus:ring-red-500"
                            : "border-border focus:ring-primary"
                        }`}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                      {validationErrors.cardExpiry && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                          <AlertCircle className="w-3 h-3" />
                          <span>{validationErrors.cardExpiry}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        CVC *
                      </label>
                      <input
                        ref={cardCVCRef}
                        type="text"
                        name="cardCVC"
                        required
                        value={paymentState.cardCVC}
                        onChange={handleCVCChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                          validationErrors.cardCVC
                            ? "border-red-500 focus:ring-red-500"
                            : "border-border focus:ring-primary"
                        }`}
                        placeholder={cardType === "amex" ? "1234" : "123"}
                        maxLength={cardType === "amex" ? 4 : 3}
                      />
                      {validationErrors.cardCVC && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                          <AlertCircle className="w-3 h-3" />
                          <span>{validationErrors.cardCVC}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex gap-2 text-sm text-blue-700">
                      <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <p>Your payment information is encrypted and secure. We do not store card details.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Bank Transfer */}
              {paymentState.method === "BANK_TRANSFER" && (
                <div className="space-y-4">
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4">
                    <p className="text-sm text-amber-700 font-medium">
                      ℹ️ Please transfer the payment to our bank account. Your order will be confirmed once we receive the funds.
                    </p>
                  </div>

                  <div className="mt-6 space-y-3 p-4 bg-muted rounded-lg">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1">TRANSFER TO</p>
                      <p className="text-sm font-semibold">EnergyHub Inc.</p>
                      <p className="text-sm text-muted-foreground">Bank: Wells Fargo</p>
                      <p className="text-sm text-muted-foreground">Account: 9876543210</p>
                      <p className="text-sm text-muted-foreground">Routing: 121000248</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1">REFERENCE</p>
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono bg-white px-3 py-2 rounded border border-border flex-1">
                          {orderID}
                        </code>
                        <button
                          type="button"
                          onClick={() => handleCopy(orderID, "reference")}
                          className="p-2 hover:bg-white rounded transition-colors"
                        >
                          {copiedField === "reference" ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Crypto Payment */}
              {paymentState.method === "CRYPTO" && (
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg mb-4">
                    <p className="text-sm text-purple-700 font-medium">
                      💜 Send the exact amount to the address below. Your order will be confirmed after blockchain confirmation.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Select Cryptocurrency *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: "bitcoin", label: "Bitcoin", symbol: "BTC" },
                        { value: "ethereum", label: "Ethereum", symbol: "ETH" },
                      ].map((crypto) => (
                        <button
                          key={crypto.value}
                          type="button"
                          onClick={() =>
                            setPaymentState({
                              ...paymentState,
                              selectedCrypto: crypto.value as "bitcoin" | "ethereum",
                            })
                          }
                          className={`p-4 rounded-lg border-2 transition-all duration-200 text-center ${
                            paymentState.selectedCrypto === crypto.value
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="font-semibold text-foreground">{crypto.label}</div>
                          <div className="text-sm text-muted-foreground">{crypto.symbol}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 space-y-4 p-4 bg-muted rounded-lg">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-2">SEND AMOUNT</p>
                      {cryptoRates ? (
                        <>
                          <div className="text-2xl font-bold text-foreground">
                            {cryptoAmount.toFixed(8)} {paymentState.selectedCrypto === "bitcoin" ? "BTC" : "ETH"}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            ≈ ${order.totalAmount.toFixed(2)} USD (1 {paymentState.selectedCrypto === "bitcoin" ? "BTC" : "ETH"} = ${paymentState.selectedCrypto === "bitcoin" ? cryptoRates.btc.toFixed(2) : cryptoRates.eth.toFixed(2)})
                          </p>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">Loading exchange rates...</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-2">SEND TO</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono bg-white px-3 py-2 rounded border border-border flex-1 overflow-auto">
                          {paymentState.selectedCrypto === "bitcoin"
                            ? "1A1z7agoat8Bt16zimYNUUY9FUe34wS4Uh"
                            : "0x742d35Cc6634C0532925a3b844Bc9e7595f1bEb4"}
                        </code>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(
                              paymentState.selectedCrypto === "bitcoin"
                                ? "1A1z7agoat8Bt16zimYNUUY9FUe34wS4Uh"
                                : "0x742d35Cc6634C0532925a3b844Bc9e7595f1bEb4",
                              "address"
                            )
                          }
                          className="p-2 hover:bg-white rounded transition-colors"
                        >
                          {copiedField === "address" ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 px-6 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Complete Payment
                </>
              )}
            </button>
          </form>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-border p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Order Summary</h3>

              <div className="space-y-3 mb-6 pb-6 border-b border-border max-h-48 overflow-y-auto">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      width={60}
                      height={60}
                      className="w-15 h-15 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span className="font-medium text-foreground">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  {order.shippingFee > 0 ? (
                    <span className="font-medium text-foreground">${order.shippingFee.toFixed(2)}</span>
                  ) : (
                    <span className="font-medium text-green-600">Free</span>
                  )}
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-xl font-bold text-primary">${order.totalAmount.toFixed(2)}</span>
              </div>

              {paymentState.method === "CRYPTO" && cryptoRates && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-700 mb-4">
                  {"You'll"} pay {cryptoAmount.toFixed(8)} {paymentState.selectedCrypto === "bitcoin" ? "BTC" : "ETH"}
                </div>
              )}

              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Secure payment processing</span>
                </div>
                <div className="flex gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>30-day return policy</span>
                </div>
                <div className="flex gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Money-back guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
