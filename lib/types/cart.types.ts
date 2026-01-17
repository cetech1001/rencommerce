/**
 * Cart Types
 * Types related to shopping cart functionality
 */

import type { ProductType } from "./product.types";

/**
 * Cart Item
 * Represents a product in the shopping cart
 */
export interface CartItem {
  id: string;
  name: string;
  price: number;
  type: ProductType;
  image: string;
  quantity: number;
}

/**
 * Cart Context Type
 * Interface for the cart context provider
 */
export interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getRentItems: () => CartItem[];
  getBuyItems: () => CartItem[];
}
