import { Recipe, GroceryItem } from '../types';

const API_BASE_URL = 'http://192.168.1.93:8080';

// Recipe API
export const recipeApi = {
  async getAllRecipes(): Promise<Recipe[]> {
    const response = await fetch(`${API_BASE_URL}/recipes`);
    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }
    return response.json();
  },

  async updateRecipe(recipe: Recipe): Promise<Recipe> {
    const response = await fetch(`${API_BASE_URL}/recipes/${recipe.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipe),
    });
    if (!response.ok) {
      throw new Error('Failed to update recipe');
    }
    return response.json();
  },
};

// Grocery API
export const groceryApi = {
  async getAllGroceries(): Promise<GroceryItem[]> {
    const response = await fetch(`${API_BASE_URL}/groceries`);
    if (!response.ok) {
      throw new Error('Failed to fetch groceries');
    }
    return response.json();
  },

  async addGrocery(grocery: { name: string; type: string }): Promise<GroceryItem> {
    const response = await fetch(`${API_BASE_URL}/groceries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(grocery),
    });
    if (!response.ok) {
      throw new Error('Failed to add grocery');
    }
    return response.json();
  },

  async deleteGrocery(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/groceries/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete grocery');
    }
  },
};
