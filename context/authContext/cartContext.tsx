// context/cartContext.tsx
import React, { createContext, useContext, useState, ReactNode, useMemo } from "react";
import { Dish } from "@/context/authContext/dishesContext";

export type CartItem = Dish & { quantity: number };

export interface CartContextType {
  cart: CartItem[];
  addToCart: (dish: Dish, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  table: number | null;
  setTable: (table: number) => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [table, setTable] = useState<number | null>(null);

  const addToCart = (dish: Dish, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.id === dish.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...dish, quantity }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);         // ✅ Limpia los productos del carrito
    setTable(null);      // ✅ Reinicia la mesa seleccionada
  };

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, total, table, setTable }}
    >
      {children}
    </CartContext.Provider>
  );
};
