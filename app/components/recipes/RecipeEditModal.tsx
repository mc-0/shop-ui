'use client';

import { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Recipe } from '../../types';

interface RecipeEditModalProps {
  recipe: Recipe;
  visible: boolean;
  onHide: () => void;
  onSave: (recipe: Recipe) => void;
}

export default function RecipeEditModal({ recipe, visible, onHide, onSave }: RecipeEditModalProps) {
  const [editedRecipe, setEditedRecipe] = useState<Recipe>(recipe);
  const [ingredientsText, setIngredientsText] = useState('');
  const [lastEatenDate, setLastEatenDate] = useState<Date | null>(null);

  useEffect(() => {
    if (recipe) {
      setEditedRecipe({ ...recipe });
      setIngredientsText(
        Array.isArray(recipe.ingredients) ? recipe.ingredients.join('\n') : ''
      );
      setLastEatenDate(recipe.lastEaten ? new Date(recipe.lastEaten) : null);
    }
  }, [recipe]);

  const handleSave = () => {
    const ingredients = ingredientsText
      .split('\n')
      .map((ingredient) => ingredient.trim())
      .filter((ingredient) => ingredient.length > 0);

    const lastEaten = lastEatenDate ? lastEatenDate.toISOString().split('T')[0] : '';

    onSave({ ...editedRecipe, ingredients, lastEaten });
    onHide();
  };

  const footer = (
    <div>
      <Button label="Cancel" icon="pi pi-times" onClick={onHide} severity="secondary" />
      <Button label="Save" icon="pi pi-check" onClick={handleSave} severity="success" />
    </div>
  );

  return (
    <Dialog
      header="Edit Recipe"
      visible={visible}
      style={{ width: '600px' }}
      onHide={onHide}
      footer={footer}
      modal
      draggable={false}
      resizable={false}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Recipe Name
          </label>
          <InputText
            id="name"
            value={editedRecipe.name}
            onChange={(e) => setEditedRecipe({ ...editedRecipe, name: e.target.value })}
            placeholder="Enter recipe name"
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="type" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Type
            </label>
            <InputText
              id="type"
              value={editedRecipe.type}
              onChange={(e) => setEditedRecipe({ ...editedRecipe, type: e.target.value })}
              placeholder="e.g., Dinner, Breakfast"
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label htmlFor="cuisine" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Cuisine
            </label>
            <InputText
              id="cuisine"
              value={editedRecipe.cuisine}
              onChange={(e) => setEditedRecipe({ ...editedRecipe, cuisine: e.target.value })}
              placeholder="e.g., Italian, Mexican"
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <div>
          <label htmlFor="url" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Recipe URL
          </label>
          <InputText
            id="url"
            type="url"
            value={editedRecipe.url}
            onChange={(e) => setEditedRecipe({ ...editedRecipe, url: e.target.value })}
            placeholder="https://example.com/recipe"
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label htmlFor="ingredients" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Ingredients (one per line)
          </label>
          <InputTextarea
            id="ingredients"
            value={ingredientsText}
            onChange={(e) => setIngredientsText(e.target.value)}
            rows={6}
            placeholder="Enter each ingredient on a new line&#10;Example:&#10;2 cups flour&#10;1 tsp salt&#10;3 eggs"
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label htmlFor="lastEaten" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Last Eaten
          </label>
          <Calendar
            id="lastEaten"
            value={lastEatenDate}
            onChange={(e) => setLastEatenDate(e.value as Date)}
            dateFormat="yy-mm-dd"
            showIcon
            placeholder="Select date"
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </Dialog>
  );
}
