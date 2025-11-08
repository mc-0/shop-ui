'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
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

  return (
    <Dialog open={visible} onClose={onHide} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Recipe</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Recipe Name"
            value={editedRecipe.name}
            onChange={(e) => setEditedRecipe({ ...editedRecipe, name: e.target.value })}
            placeholder="Enter recipe name"
            fullWidth
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Type"
              value={editedRecipe.type}
              onChange={(e) => setEditedRecipe({ ...editedRecipe, type: e.target.value })}
              placeholder="e.g., Dinner, Breakfast"
              fullWidth
            />
            <TextField
              label="Cuisine"
              value={editedRecipe.cuisine}
              onChange={(e) => setEditedRecipe({ ...editedRecipe, cuisine: e.target.value })}
              placeholder="e.g., Italian, Mexican"
              fullWidth
            />
          </Box>

          <TextField
            label="Recipe URL"
            type="url"
            value={editedRecipe.url}
            onChange={(e) => setEditedRecipe({ ...editedRecipe, url: e.target.value })}
            placeholder="https://example.com/recipe"
            fullWidth
          />

          <TextField
            label="Ingredients (one per line)"
            value={ingredientsText}
            onChange={(e) => setIngredientsText(e.target.value)}
            multiline
            rows={6}
            placeholder="Enter each ingredient on a new line&#10;Example:&#10;2 cups flour&#10;1 tsp salt&#10;3 eggs"
            fullWidth
          />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Last Eaten"
              value={lastEatenDate}
              onChange={(newValue) => setLastEatenDate(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  placeholder: 'Select date',
                },
              }}
            />
          </LocalizationProvider>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onHide} color="secondary" startIcon={<CloseIcon />}>
          Cancel
        </Button>
        <Button onClick={handleSave} color="success" variant="contained" startIcon={<CheckIcon />}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
