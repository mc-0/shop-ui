'use client';

import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Recipe } from '../../types';
import RecipeEditModal from './RecipeEditModal';
import IngredientsModal from './IngredientsModal';

interface RecipesTabProps {
  recipes: Recipe[];
  selectedRecipes: Recipe[];
  onRecipeSelected: (recipe: Recipe) => void;
  onRecipeSaved: (recipe: Recipe) => void;
  onRefresh: () => void;
  loading: boolean;
}

export default function RecipesTab({
  recipes,
  selectedRecipes,
  onRecipeSelected,
  onRecipeSaved,
  onRefresh,
  loading,
}: RecipesTabProps) {
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [typeOptions, setTypeOptions] = useState<{ label: string; value: string }[]>([]);
  const [cuisineOptions, setCuisineOptions] = useState<{ label: string; value: string }[]>([]);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    if (recipes.length > 0) {
      updateDropdownOptions();
      applyFilters();
    } else {
      setFilteredRecipes([]);
    }
  }, [recipes, searchTerm, selectedType, selectedCuisine]);

  const updateDropdownOptions = () => {
    // Get unique types
    const allTypes = new Set<string>();
    recipes.forEach((recipe) => {
      if (recipe.type) {
        const types =
          typeof recipe.type === 'string'
            ? recipe.type.split(',').map((t) => t.trim())
            : [recipe.type];
        types.forEach((type) => allTypes.add(type));
      }
    });
    setTypeOptions(
      Array.from(allTypes)
        .sort()
        .map((type) => ({ label: type, value: type }))
    );

    // Get unique cuisines
    const allCuisines = new Set<string>();
    recipes.forEach((recipe) => {
      if (recipe.cuisine) {
        const cuisines =
          typeof recipe.cuisine === 'string'
            ? recipe.cuisine.split(',').map((c) => c.trim())
            : [recipe.cuisine];
        cuisines.forEach((cuisine) => allCuisines.add(cuisine));
      }
    });
    setCuisineOptions(
      Array.from(allCuisines)
        .sort()
        .map((cuisine) => ({ label: cuisine, value: cuisine }))
    );
  };

  const applyFilters = () => {
    let filtered = [...recipes];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (recipe) =>
          recipe.name.toLowerCase().includes(search) ||
          recipe.type.toLowerCase().includes(search) ||
          recipe.cuisine.toLowerCase().includes(search)
      );
    }

    if (selectedType) {
      filtered = filtered.filter((recipe) => {
        if (!recipe.type) return false;
        const types =
          typeof recipe.type === 'string'
            ? recipe.type.split(',').map((t) => t.trim())
            : [recipe.type];
        return types.includes(selectedType);
      });
    }

    if (selectedCuisine) {
      filtered = filtered.filter((recipe) => {
        if (!recipe.cuisine) return false;
        const cuisines =
          typeof recipe.cuisine === 'string'
            ? recipe.cuisine.split(',').map((c) => c.trim())
            : [recipe.cuisine];
        return cuisines.includes(selectedCuisine);
      });
    }

    setFilteredRecipes(filtered);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setSelectedCuisine('');
  };

  const isRecipeSelected = (recipe: Recipe): boolean => {
    return selectedRecipes.some((selected) => selected.name === recipe.name);
  };

  const recipeNameBodyTemplate = (recipe: Recipe) => {
    return (
      <div className="recipe-info">
        <div className="recipe-name">
          {recipe.url && recipe.url.trim() ? (
            <a href={recipe.url} target="_blank" rel="noopener" className="recipe-link">
              {recipe.name}
              <i className="pi pi-external-link link-icon" style={{ marginLeft: '0.5rem' }} />
            </a>
          ) : (
            recipe.name
          )}
        </div>
        <div className="recipe-meta">
          {recipe.type} • {recipe.cuisine}
        </div>
      </div>
    );
  };

  const ingredientsBodyTemplate = (recipe: Recipe) => {
    return (
      <Button
        icon="pi pi-eye"
        onClick={() => setViewingRecipe(recipe)}
        severity="secondary"
        text
        size="small"
      />
    );
  };

  const actionsBodyTemplate = (recipe: Recipe) => {
    const isSelected = isRecipeSelected(recipe);
    return (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button
          label="Add"
          icon="pi pi-plus"
          onClick={() => onRecipeSelected(recipe)}
          severity="success"
          size="small"
          disabled={isSelected}
        />
        <Button
          label="Edit"
          icon="pi pi-pencil"
          onClick={() => setEditingRecipe(recipe)}
          severity="info"
          size="small"
          disabled={isSelected}
        />
      </div>
    );
  };

  const rowClassName = (recipe: Recipe) => {
    return isRecipeSelected(recipe) ? 'selected-recipe' : '';
  };

  return (
    <div className="tab-content">
      <div className="tab-header">
        <Button label="Refresh Recipes" icon="pi pi-refresh" onClick={onRefresh} severity="info" />
      </div>

      <div className="recipe-table-container">
        {/* Filter Controls */}
        <div className="filter-controls" style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div className="search-control" style={{ position: 'relative', flex: '1 1 300px' }}>
              <InputText
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search recipes..."
                style={{ width: '100%' }}
              />
              <i
                className="pi pi-search"
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6b7280',
                }}
              />
            </div>

            <Dropdown
              value={selectedType}
              options={typeOptions}
              onChange={(e) => setSelectedType(e.value)}
              placeholder="All Types"
              showClear
              style={{ flex: '0 1 200px' }}
            />

            <Dropdown
              value={selectedCuisine}
              options={cuisineOptions}
              onChange={(e) => setSelectedCuisine(e.value)}
              placeholder="All Cuisines"
              showClear
              style={{ flex: '0 1 200px' }}
            />

            <Button
              label="Clear Filters"
              icon="pi pi-filter-slash"
              onClick={clearAllFilters}
              severity="secondary"
              size="small"
            />
          </div>
        </div>

        {/* Table */}
        <DataTable
          value={filteredRecipes}
          scrollable
          scrollHeight="400px"
          loading={loading}
          rowClassName={rowClassName}
          sortMode="single"
        >
          <Column
            field="name"
            header="Recipe"
            body={recipeNameBodyTemplate}
            sortable
            style={{ minWidth: '250px' }}
          />
          <Column
            field="lastEaten"
            header="Last Eaten"
            sortable
            style={{ minWidth: '120px' }}
          />
          <Column
            header="Ingredients"
            body={ingredientsBodyTemplate}
            style={{ width: '100px', textAlign: 'center' }}
          />
          <Column
            header="Actions"
            body={actionsBodyTemplate}
            style={{ minWidth: '200px' }}
          />
        </DataTable>
      </div>

      {/* Modals */}
      {editingRecipe && (
        <RecipeEditModal
          recipe={editingRecipe}
          visible={!!editingRecipe}
          onHide={() => setEditingRecipe(null)}
          onSave={onRecipeSaved}
        />
      )}

      {viewingRecipe && (
        <IngredientsModal
          recipe={viewingRecipe}
          visible={!!viewingRecipe}
          onHide={() => setViewingRecipe(null)}
        />
      )}
    </div>
  );
}
