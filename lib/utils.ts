import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Product } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getMode = ({ rentalPrice, purchasePrice }: Product) => {
  if (rentalPrice > 0 && purchasePrice === 0) {
    return "rental";
  } else if (purchasePrice > 0 && rentalPrice === 0) {
    return "purchase";
  }
  return undefined;
}
