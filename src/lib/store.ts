'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { addLine, lineKey, toggleId, type CartLine } from './catalog';
type State = {
  cart: CartLine[];
  wishlist: string[];
  lastOrder: { number: string; total: number; count: number } | null;
  add: (l: Omit<CartLine, 'quantity'>) => void;
  quantity: (key: string, n: number) => void;
  remove: (key: string) => void;
  toggle: (id: string) => void;
  checkout: (total: number, count: number, clearCart?: boolean) => void;
  reset: () => void;
};
export const useShop = create<State>()(
  persist(
    (set) => ({
      cart: [],
      wishlist: [],
      lastOrder: null,
      add: (l) => set((s) => ({ cart: addLine(s.cart, l) })),
      quantity: (key, n) =>
        set((s) => ({
          cart: s.cart.map((l) =>
            lineKey(l) === key ? { ...l, quantity: Math.max(1, Math.min(99, n)) } : l,
          ),
        })),
      remove: (key) => set((s) => ({ cart: s.cart.filter((l) => lineKey(l) !== key) })),
      toggle: (id) => set((s) => ({ wishlist: toggleId(s.wishlist, id) })),
      checkout: (total, count, clearCart = true) =>
        set((s) => ({
          cart: clearCart ? [] : s.cart,
          lastOrder: { number: `EV-${Date.now().toString(36).toUpperCase()}`, total, count },
        })),
      reset: () => set({ cart: [], wishlist: [], lastOrder: null }),
    }),
    { name: 'eonve-shop', storage: createJSONStorage(() => localStorage), skipHydration: true },
  ),
);
