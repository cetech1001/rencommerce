import type { RegisterData } from "./auth.types";

export type CheckoutItemType = "RENT" | "PURCHASE";

export interface CheckoutItem {
  productID: string;
  quantity: number;
  price: number;
  type: CheckoutItemType;
  rentalStartDate?: string | null;
  rentalEndDate?: string | null;
}

export interface AddressData {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CheckoutData {
  items: CheckoutItem[];
  billingAddress: AddressData;
  shippingAddress: AddressData;
  sameAsBilling: boolean;
  totalAmount: number;
  shippingFee: number;
  discountFee: number;
  taxFee: number;
  couponCode?: string;
  accountData?: RegisterData;
}
