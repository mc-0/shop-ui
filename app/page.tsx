'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Recipe, GroceryItem } from './types';
import { recipeApi, groceryApi } from './lib/api';
import { useSelectionStore } from './lib/store';
import RecipesTab from './components/recipes/RecipesTab';
import GroceriesTab from './components/groceries/GroceriesTab';
import ShoppingListTab from './components/shopping-list/ShoppingListTab';

type Tab = 'recipes' | 'groceries' | 'list';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('recipes');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [groceries, setGroceries] = useState<GroceryItem[]>([]);
  const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>([]);
  const [selectedGroceries, setSelectedGroceries] = useState<GroceryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const items = useSelectionStore((state) => state.items);
  const addItems = useSelectionStore((state) => state.addItems);
  const addItem = useSelectionStore((state) => state.addItem);

  // Load initial data
  useEffect(() => {
    loadRecipes();
    loadGroceries();
  }, []);

  // Sync selected recipes/groceries with selection store
  useEffect(() => {
    // Update selected recipes based on current items
    setSelectedRecipes((prev) =>
      prev.filter((recipe) => {
        if (!recipe.ingredients || recipe.ingredients.length === 0) {
          return false;
        }
        return recipe.ingredients.some((ingredient) =>
          items.some((item) => item.name.toLowerCase() === ingredient.toLowerCase())
        );
      })
    );

    // Update selected groceries based on current items
    setSelectedGroceries((prev) =>
      prev.filter((grocery) =>
        items.some((item) => item.name.toLowerCase() === grocery.name.toLowerCase())
      )
    );
  }, [items]);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      const data = await recipeApi.getAllRecipes();
      setRecipes(data);
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadGroceries = async () => {
    try {
      setLoading(true);
      const data = await groceryApi.getAllGroceries();
      setGroceries(data);
    } catch (error) {
      console.error('Error loading groceries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeSelected = (recipe: Recipe) => {
    if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
      addItems(recipe.ingredients);
      if (!selectedRecipes.some((r) => r.name === recipe.name)) {
        setSelectedRecipes([...selectedRecipes, recipe]);
      }
    }
  };

  const handleRecipeSaved = async (updatedRecipe: Recipe) => {
    try {
      await recipeApi.updateRecipe(updatedRecipe);
      setRecipes(
        recipes.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r))
      );
    } catch (error) {
      console.error('Error updating recipe:', error);
    }
  };

  const handleGrocerySelected = (grocery: GroceryItem) => {
    addItem(grocery.name);
    if (!selectedGroceries.some((g) => g.id === grocery.id)) {
      setSelectedGroceries([...selectedGroceries, grocery]);
    }
  };

  const handleGroceryDeleted = async (grocery: GroceryItem) => {
    try {
      await groceryApi.deleteGrocery(grocery.id);
      setGroceries(groceries.filter((g) => g.id !== grocery.id));
    } catch (error) {
      console.error('Error deleting grocery:', error);
    }
  };

  const handleGroceryAdded = async (newItem: { name: string; type: string }) => {
    try {
      const addedItem = await groceryApi.addGrocery(newItem);
      setGroceries([...groceries, addedItem]);
    } catch (error) {
      console.error('Error adding grocery:', error);
    }
  };

  return (
    <div className="main-container">
      <header className="main-header">
        <Image
          src="/assets/nomses.png"
          alt="Grocery Time"
          width={64}
          height={64}
          className="brand-logo"
          priority
        />
        <div className="tab-buttons">
          <button
            className={`tab-btn ${activeTab === 'recipes' ? 'active' : ''}`}
            onClick={() => setActiveTab('recipes')}
          >
            <i className="pi pi-book" />
            Recipes
          </button>
          <button
            className={`tab-btn ${activeTab === 'groceries' ? 'active' : ''}`}
            onClick={() => setActiveTab('groceries')}
          >
            <i className="pi pi-shopping-bag" />
            Groceries
          </button>
          <button
            className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            <i className="pi pi-list" />
            <span>List</span>
            {items.length > 0 && <span className="item-count-badge">{items.length}</span>}
          </button>
        </div>
      </header>

      <main className="main-content">
        {activeTab === 'recipes' && (
          <RecipesTab
            recipes={recipes}
            selectedRecipes={selectedRecipes}
            onRecipeSelected={handleRecipeSelected}
            onRecipeSaved={handleRecipeSaved}
            onRefresh={loadRecipes}
            loading={loading}
          />
        )}
        {activeTab === 'groceries' && (
          <GroceriesTab
            groceries={groceries}
            selectedGroceries={selectedGroceries}
            onGrocerySelected={handleGrocerySelected}
            onGroceryDeleted={handleGroceryDeleted}
            onGroceryAdded={handleGroceryAdded}
            onRefresh={loadGroceries}
            loading={loading}
          />
        )}
        {activeTab === 'list' && <ShoppingListTab items={items} />}
      </main>
    </div>
  );
}
