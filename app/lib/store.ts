import { create } from 'zustand';
import { SelectionItem } from '../types';

interface SelectionStore {
  items: SelectionItem[];
  addItem: (name: string) => void;
  addItems: (names: string[]) => void;
  removeItem: (name: string) => void;
  setStore: (name: string, store: string) => void;
  clearAll: () => void;
}

export const useSelectionStore = create<SelectionStore>((set) => ({
  items: [],

  addItem: (name: string) =>
    set((state) => {
      // Check if item already exists (case-insensitive)
      const exists = state.items.some(
        (item) => item.name.toLowerCase() === name.toLowerCase()
      );

      if (!exists) {
        return { items: [...state.items, { name, store: null }] };
      }
      return state;
    }),

  addItems: (names: string[]) =>
    set((state) => {
      const newItems: SelectionItem[] = [];

      names.forEach((name) => {
        const exists =
          state.items.some((item) => item.name.toLowerCase() === name.toLowerCase()) ||
          newItems.some((item) => item.name.toLowerCase() === name.toLowerCase());

        if (!exists) {
          newItems.push({ name, store: null });
        }
      });

      if (newItems.length > 0) {
        return { items: [...state.items, ...newItems] };
      }
      return state;
    }),

  removeItem: (name: string) =>
    set((state) => ({
      items: state.items.filter((item) => item.name !== name),
    })),

  setStore: (name: string, store: string) =>
    set((state) => ({
      items: state.items.map((item) => (item.name === name ? { ...item, store } : item)),
    })),

  clearAll: () => set({ items: [] }),
}));
