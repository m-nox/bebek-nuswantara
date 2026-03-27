import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { menuItems } from '../data/menu';

export interface CartItem {
  id: string;
  quantity: number;
}

export interface OrderData {
  serviceType: 'Dine-in' | 'Take Away';
  name: string;
  phone: string;
  address?: string;
  peopleCount?: number;
  date: string;
  time: string;
}

interface CartContextType {
  items: CartItem[];
  orderData: OrderData | null;
  paymentMethod: string | null;
  updateQuantity: (id: string, delta: number) => void;
  setOrderData: (data: OrderData) => void;
  setPaymentMethod: (method: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orderData, setOrderDataState] = useState<OrderData | null>(null);
  const [paymentMethod, setPaymentMethodState] = useState<string | null>(null);

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) => {
      const existing = prev.find(item => item.id === id);
      if (existing) {
        const newQuantity = existing.quantity + delta;
        if (newQuantity <= 0) {
          return prev.filter(item => item.id !== id);
        }
        return prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item);
      } else if (delta > 0) {
        return [...prev, { id, quantity: delta }];
      }
      return prev;
    });
  };

  const clearCart = () => {
    setItems([]);
    setOrderDataState(null);
    setPaymentMethodState(null);
  };

  const getTotal = () => {
    return items.reduce((total, item) => {
      const menu = menuItems.find(m => m.id === item.id);
      return total + (menu?.price || 0) * item.quantity;
    }, 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      items, orderData, paymentMethod,
      updateQuantity, setOrderData: setOrderDataState, setPaymentMethod: setPaymentMethodState,
      clearCart, getTotal, getItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
