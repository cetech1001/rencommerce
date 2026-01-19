export type PaymentMethod = "CARD" | "BANK_TRANSFER" | "CRYPTO";

export interface PaymentData {
  orderID: string;
  paymentMethod: PaymentMethod;
  paymentInfo: Record<string, string>;
}

export type CryptoCurrency = "bitcoin" | "ethereum";

export interface PaymentFormState {
  method: PaymentMethod;
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCVC: string;
  selectedCrypto: CryptoCurrency;
}
