export type PaymentMethod = "CARD" | "BANK_TRANSFER" | "CRYPTO";

export interface PaymentData {
  orderID: string;
  paymentMethod: PaymentMethod;
  paymentInfo: Record<string, any>;
}

export type CryptoCurrency = "bitcoin" | "ethereum";

export interface PaymentFormState {
  method: PaymentMethod;
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCVC: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  routingNumber: string;
  walletAddress: string;
  selectedCrypto: CryptoCurrency;
}
