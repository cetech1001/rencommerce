import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Product } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const PRODUCT_CARD_MODE = {
  RENTAL: 'RENTAL',
  PURCHASE: 'PURCHASE',
} as const;
export type PRODUCT_CARD_MODE = typeof PRODUCT_CARD_MODE[keyof typeof PRODUCT_CARD_MODE];

export const getMode = ({
  rentalPrice,
  purchasePrice
}: Pick<Product, 'rentalPrice' | 'purchasePrice'>):
  PRODUCT_CARD_MODE | undefined => {
  if (rentalPrice > 0 && purchasePrice === 0) {
    return PRODUCT_CARD_MODE.RENTAL;
  } else if (purchasePrice > 0 && rentalPrice === 0) {
    return PRODUCT_CARD_MODE.PURCHASE;
  }
  return undefined;
}

export const convertToCrypto = (
  usdAmount: number,
  cryptoRate: number
): number => {
  if (cryptoRate === 0) return 0;
  return usdAmount / cryptoRate;
}
