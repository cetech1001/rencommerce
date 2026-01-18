"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Lock, Copy, Check, Zap, DollarSign, Bitcoin, Loader2 } from "lucide-react";
import { useCart } from "@/lib/contexts";
import { getOrderByID } from "@/lib/queries/orders";
import { processPayment } from "@/lib/actions/payment";

type PaymentMethod = "CARD" | "BANK_TRANSFER" | "CRYPTO";

interface PaymentState {
  method: PaymentMethod;
  // Card fields
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCVC: string;
  // Bank transfer fields
  accountName: string;
  accountNumber: string;
  bankName: string;
  routingNumber: string;
  // Crypto fields
  walletAddress: string;
  selectedCrypto: "bitcoin" | "ethereum";
}

interface OrderData {
  id: string;
  totalAmount: number;
  shippingFee: number;
  status: string;
  orderItems: {
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      image: string;
    };
  }[];
}

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const orderID = params.orderID as string;
  const { clearCart } = useCart();

  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [paymentState, setPaymentState] = useState<PaymentState>({
    method: "CARD",
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVC: "",
    accountName: "",
    accountNumber: "",
    bankName: "",
    routingNumber: "",
    walletAddress: "",
    selectedCrypto: "bitcoin",
  });

  // Crypto exchange rates (in a real app, these would be fetched from an API)
  const cryptoRates: Record<string, number> = {
    bitcoin: 42500,
    ethereum: 2250,
  };

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
      } else {
        setError("Order not found");
      }
    } catch (err) {
      setError("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPaymentState({ ...paymentState, [name]: value });
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const validateCardPayment = () => {
    if (!paymentState.cardName || !paymentState.cardNumber || !paymentState.cardExpiry || !paymentState.cardCVC) {
      setError("Please fill in all card payment details.");
      return false;
    }
    return true;
  };

  const validateBankPayment = () => {
    if (!paymentState.accountName || !paymentState.accountNumber || !paymentState.bankName || !paymentState.routingNumber) {
      setError("Please fill in all bank transfer details.");
      return false;
    }
    return true;
  };

  const validateCryptoPayment = () => {
    if (!paymentState.walletAddress) {
      setError("Please provide your wallet address.");
      return false;
    }
    return true;
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate based on payment method
    if (paymentState.method === "CARD" && !validateCardPayment()) return;
    if (paymentState.method === "BANK_TRANSFER" && !validateBankPayment()) return;
    if (paymentState.method === "CRYPTO" && !validateCryptoPayment()) return;

    setIsProcessing(true);

    const result = await processPayment({
      orderID: orderID,
      paymentMethod: paymentState.method,
      paymentInfo: {
        cardName: paymentState.cardName,
        cardNumberLast4: paymentState.cardNumber.slice(-4),
        accountName: paymentState.accountName,
        bankName: paymentState.bankName,
        walletAddress: paymentState.walletAddress,
        crypto: paymentState.selectedCrypto,
      },
    });

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
  const cryptoAmount = order.totalAmount / cryptoRates[paymentState.selectedCrypto];

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
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      required
                      value={paymentState.cardNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        name="cardExpiry"
                        required
                        value={paymentState.cardExpiry}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        CVC *
                      </label>
                      <input
                        type="text"
                        name="cardCVC"
                        required
                        value={paymentState.cardCVC}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="123"
                        maxLength={3}
                      />
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

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="accountName"
                      required
                      value={paymentState.accountName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Your Full Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Your Bank Name *
                    </label>
                    <input
                      type="text"
                      name="bankName"
                      required
                      value={paymentState.bankName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Chase Bank"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Routing Number *
                      </label>
                      <input
                        type="text"
                        name="routingNumber"
                        required
                        value={paymentState.routingNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                        placeholder="021000021"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Account Number *
                      </label>
                      <input
                        type="text"
                        name="accountNumber"
                        required
                        value={paymentState.accountNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                        placeholder="1234567890"
                      />
                    </div>
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
                      <div className="text-2xl font-bold text-foreground">
                        {cryptoAmount.toFixed(8)} {paymentState.selectedCrypto.toUpperCase()}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        ≈ ${order.totalAmount.toFixed(2)} USD
                      </p>
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

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Your Wallet Address (for confirmation) *
                    </label>
                    <input
                      type="text"
                      name="walletAddress"
                      required
                      value={paymentState.walletAddress}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                      placeholder="Your wallet address where you're sending from"
                    />
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

              {paymentState.method === "CRYPTO" && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-700 mb-4">
                  {"You'll"} pay {cryptoAmount.toFixed(8)} {paymentState.selectedCrypto.toUpperCase()}
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
