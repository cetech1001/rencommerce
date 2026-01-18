export type ProductType = "rent" | "purchase";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  type: ProductType;
  image: string;
  quantity: number;
  rentalStartDate?: string;
  rentalEndDate?: string;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productID: string, type: ProductType) => void;
  updateQuantity: (productID: string, type: ProductType, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getRentItems: () => CartItem[];
  getBuyItems: () => CartItem[];
  getItemQuantity: (productId: string, type: ProductType) => number;
}
