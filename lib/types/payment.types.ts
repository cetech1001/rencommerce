export type PaymentMethod = "CARD" | "BANK_TRANSFER" | "CRYPTO";

export interface PaymentData {
  orderID: string;
  paymentMethod: PaymentMethod;
  paymentInfo: Record<string, string>;
}
