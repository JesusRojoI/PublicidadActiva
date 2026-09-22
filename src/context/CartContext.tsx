'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface CartItem {
  id: string;
  sku: string;
  nameKey: string;
  nameFallback: string;
  price: number;
  quantity: number;
  isCustom?: boolean;
  customData?: { proposalNumber: string };
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  restoreItem: (item: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  coupon: string | null;
  discountPercent: number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const VALID_COUPONS: Record<string, number> = {
  'nweap12z5c': 1,
  'kq9wm4xe2b': 5,
  'zr7ty1uv8m': 10,
  'ph3sd6jl4n': 15,
  'qw8er2ty5u': 20,
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('pa_cart');
      const savedCoupon = localStorage.getItem('pa_coupon');
      if (saved) setItems(JSON.parse(saved));
      if (savedCoupon) {
        setCoupon(savedCoupon);
        setDiscountPercent(VALID_COUPONS[savedCoupon] || 0);
      }
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem('pa_cart', JSON.stringify(items));
    }
  }, [items, loaded]);

  useEffect(() => {
    if (loaded) {
      if (coupon) localStorage.setItem('pa_coupon', coupon);
      else localStorage.removeItem('pa_coupon');
    }
  }, [coupon, loaded]);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setItems((prev) => {
      // Productos personalizados siempre se agregan como nueva línea
      if (item.isCustom) {
        return [...prev, { ...item, quantity: item.quantity || 1, id: `${item.id}-${Date.now()}` }];
      }
      const existing = prev.find((i) => i.sku === item.sku);
      if (existing) {
        return prev.map((i) =>
          i.sku === item.sku ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
        );
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const restoreItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      if (prev.find((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setCoupon(null);
    setDiscountPercent(0);
  }, []);

  const applyCoupon = useCallback((code: string) => {
    const normalized = code.trim().toLowerCase();
    if (VALID_COUPONS[normalized] !== undefined) {
      setCoupon(normalized);
      setDiscountPercent(VALID_COUPONS[normalized]);
      return true;
    }
    return false;
  }, []);

  const removeCoupon = useCallback(() => {
    setCoupon(null);
    setDiscountPercent(0);
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = subtotal * (discountPercent / 100);
  const taxableBase = subtotal - discount;
  const tax = taxableBase * 0.16;
  const total = taxableBase + tax;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        restoreItem,
        updateQuantity,
        clearCart,
        coupon,
        discountPercent,
        applyCoupon,
        removeCoupon,
        subtotal,
        discount,
        tax,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}