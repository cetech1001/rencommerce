"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { CartItem, CartContextType, ProductType } from "@/lib/types";

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "rencommerce_cart";

// Helper function to generate unique cart item key
const getCartItemKey = (productID: string, type: ProductType) => {
  return `${productID}_${type}`;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error("Failed to save cart to localStorage:", error);
      }
    }
  }, [items, isHydrated]);

  const addToCart = useCallback((item: CartItem) => {
    setItems((prevItems) => {
      // Find existing item with same product ID and type
      const cartKey = getCartItemKey(item.id, item.type);
      const existingItemIndex = prevItems.findIndex(
        (i) => getCartItemKey(i.id, i.type) === cartKey
      );

      if (existingItemIndex > -1) {
        // Update quantity of existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + item.quantity,
        };
        return updatedItems;
      }

      // Add new item
      return [...prevItems, item];
    });
  }, []);

  const removeFromCart = useCallback((productId: string, type: "rent" | "purchase") => {
    setItems((prevItems) => {
      const cartKey = getCartItemKey(productId, type);
      return prevItems.filter((i) => getCartItemKey(i.id, i.type) !== cartKey);
    });
  }, []);

  const updateQuantity = useCallback((productId: string, type: "rent" | "purchase", quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, type);
      return;
    }

    setItems((prevItems) => {
      const cartKey = getCartItemKey(productId, type);
      return prevItems.map((i) =>
        getCartItemKey(i.id, i.type) === cartKey ? { ...i, quantity } : i
      );
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  const getRentItems = useCallback(() => {
    return items.filter((item) => item.type === "rent");
  }, [items]);

  const getBuyItems = useCallback(() => {
    return items.filter((item) => item.type === "purchase");
  }, [items]);

  const getItemQuantity = useCallback((productId: string, type: "rent" | "purchase") => {
    const cartKey = getCartItemKey(productId, type);
    const item = items.find((i) => getCartItemKey(i.id, i.type) === cartKey);
    return item?.quantity || 0;
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        getRentItems,
        getBuyItems,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
