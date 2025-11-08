'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Box,
  InputAdornment,
  IconButton,
  Link,
  Typography,
  TableSortLabel,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
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

type Order = 'asc' | 'desc';
type OrderBy = 'name' | 'lastEaten';

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
  const [typeOptions, setTypeOptions] = useState<string[]>([]);
  const [cuisineOptions, setCuisineOptions] = useState<string[]>([]);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<OrderBy>('name');

  useEffect(() => {
    if (recipes.length > 0) {
      updateDropdownOptions();
      applyFilters();
    } else {
      setFilteredRecipes([]);
    }
  }, [recipes, searchTerm, selectedType, selectedCuisine, order, orderBy]);

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
    setTypeOptions(Array.from(allTypes).sort());

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
    setCuisineOptions(Array.from(allCuisines).sort());
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

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[orderBy] || '';
      const bValue = b[orderBy] || '';
      if (order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

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

  const handleRequestSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <div className="tab-content">
      <div className="tab-header">
        <Button variant="contained" color="info" startIcon={<RefreshIcon />} onClick={onRefresh}>
          Refresh Recipes
        </Button>
      </div>

      <div className="recipe-table-container">
        {/* Filter Controls */}
        <Box sx={{ mb: 2, display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <TextField
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search recipes..."
            size="small"
            sx={{ flex: '1 1 300px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <FormControl size="small" sx={{ flex: '0 1 200px' }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              label="Type"
            >
              <MenuItem value="">All Types</MenuItem>
              {typeOptions.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ flex: '0 1 200px' }}>
            <InputLabel>Cuisine</InputLabel>
            <Select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              label="Cuisine"
            >
              <MenuItem value="">All Cuisines</MenuItem>
              {cuisineOptions.map((cuisine) => (
                <MenuItem key={cuisine} value={cuisine}>
                  {cuisine}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            color="secondary"
            size="small"
            startIcon={<FilterAltOffIcon />}
            onClick={clearAllFilters}
          >
            Clear Filters
          </Button>
        </Box>

        {/* Table */}
        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 250 }}>
                  <TableSortLabel
                    active={orderBy === 'name'}
                    direction={orderBy === 'name' ? order : 'asc'}
                    onClick={() => handleRequestSort('name')}
                  >
                    Recipe
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ minWidth: 120 }}>
                  <TableSortLabel
                    active={orderBy === 'lastEaten'}
                    direction={orderBy === 'lastEaten' ? order : 'asc'}
                    onClick={() => handleRequestSort('lastEaten')}
                  >
                    Last Eaten
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ width: 100, textAlign: 'center' }}>Ingredients</TableCell>
                <TableCell sx={{ minWidth: 200 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredRecipes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No recipes found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecipes.map((recipe) => {
                  const isSelected = isRecipeSelected(recipe);
                  return (
                    <TableRow
                      key={recipe.id}
                      sx={{
                        backgroundColor: isSelected ? 'rgba(139, 92, 246, 0.1)' : 'inherit',
                        '&:hover': {
                          backgroundColor: isSelected
                            ? 'rgba(139, 92, 246, 0.15)'
                            : 'rgba(255, 255, 255, 0.05)',
                        },
                      }}
                    >
                      <TableCell>
                        <Box>
                          {recipe.url && recipe.url.trim() ? (
                            <Link
                              href={recipe.url}
                              target="_blank"
                              rel="noopener"
                              sx={{
                                color: 'primary.light',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                '&:hover': { textDecoration: 'underline' },
                              }}
                            >
                              {recipe.name}
                              <OpenInNewIcon sx={{ fontSize: 16 }} />
                            </Link>
                          ) : (
                            <Typography>{recipe.name}</Typography>
                          )}
                          <Typography variant="caption" color="text.secondary">
                            {recipe.type} • {recipe.cuisine}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{recipe.lastEaten}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => setViewingRecipe(recipe)}
                          color="secondary"
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<AddIcon />}
                            onClick={() => onRecipeSelected(recipe)}
                            disabled={isSelected}
                          >
                            Add
                          </Button>
                          <Button
                            variant="contained"
                            color="info"
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() => setEditingRecipe(recipe)}
                            disabled={isSelected}
                          >
                            Edit
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
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
