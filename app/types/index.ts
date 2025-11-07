export interface Recipe {
  id: string;
  name: string;
  type: string;
  cuisine: string;
  lastEaten: string;
  ingredients: string[];
  url: string;
}

export interface GroceryItem {
  id: string;
  name: string;
  type: string;
}

export interface SelectionItem {
  name: string;
  store: string | null;
}

export const GROCERY_TYPES = [
  'Fruit',
  'Vegetable',
  'Meat',
  'Home Goods',
  'Grain',
  'Legume',
  'Nuts/Seeds',
  'Condiments',
  'Seafood',
  'Snacks',
  'Cereal',
  'Dessert',
  'Bread',
] as const;

export const STORES = ['Meijer', "BJ's", 'Fresh Thyme', 'Papaya'] as const;
