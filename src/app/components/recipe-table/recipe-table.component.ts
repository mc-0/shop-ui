import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { Recipe } from '../../services/recipe.service';

@Component({
  selector: 'app-recipe-table',
  templateUrl: './recipe-table.component.html',
  styleUrl: './recipe-table.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, Select, TooltipModule]
})
export class RecipeTableComponent implements OnChanges {
  @Input() recipes: Recipe[] = [];
  @Input() selectedRecipes: Recipe[] = [];
  @Output() recipeSelected = new EventEmitter<Recipe>();
  @Output() editRecipe = new EventEmitter<Recipe>();
  @Output() viewIngredients = new EventEmitter<Recipe>();

  // Filtering and sorting properties
  filteredRecipes: Recipe[] = [];
  searchTerm: string = '';
  selectedType: string = '';
  selectedCuisine: string = '';

  // Dropdown options
  typeOptions: {label: string, value: string}[] = [];
  cuisineOptions: {label: string, value: string}[] = [];

  ngOnChanges() {
    console.log('ngOnChanges called, recipes length:', this.recipes.length);
    if (this.recipes && this.recipes.length > 0) {
      this.updateDropdownOptions();
      this.applyFilters();
    } else {
      // If no recipes, clear the filtered list
      this.filteredRecipes = [];
    }
  }

  updateDropdownOptions() {
    console.log('Sample recipe data:', this.recipes[0]);
    
    // Get unique types - handle different data formats
    const allTypes = new Set<string>();
    this.recipes.forEach(recipe => {
      if (recipe.type) {
        let types: string[] = [];
        
        if (Array.isArray(recipe.type)) {
          // If type is already an array
          types = recipe.type.filter(t => t && typeof t === 'string');
        } else if (typeof recipe.type === 'string') {
          // If type is a string, split by comma
          types = recipe.type.split(',').map(t => t.trim()).filter(t => t);
        } else {
          // Convert to string if it's something else
          types = [String(recipe.type)].filter(t => t && t !== 'undefined' && t !== 'null');
        }
        
        types.forEach(type => allTypes.add(type));
      }
    });
    this.typeOptions = Array.from(allTypes).sort().map(type => ({ label: type, value: type }));
    console.log('Type options:', this.typeOptions);

    // Get unique cuisines - handle different data formats
    const allCuisines = new Set<string>();
    this.recipes.forEach(recipe => {
      if (recipe.cuisine) {
        let cuisines: string[] = [];
        
        if (Array.isArray(recipe.cuisine)) {
          // If cuisine is already an array
          cuisines = recipe.cuisine.filter(c => c && typeof c === 'string');
        } else if (typeof recipe.cuisine === 'string') {
          // If cuisine is a string, split by comma
          cuisines = recipe.cuisine.split(',').map(c => c.trim()).filter(c => c);
        } else {
          // Convert to string if it's something else
          cuisines = [String(recipe.cuisine)].filter(c => c && c !== 'undefined' && c !== 'null');
        }
        
        cuisines.forEach(cuisine => allCuisines.add(cuisine));
      }
    });
    this.cuisineOptions = Array.from(allCuisines).sort().map(cuisine => ({ label: cuisine, value: cuisine }));
    console.log('Cuisine options:', this.cuisineOptions);
  }

  applyFilters() {
    let filtered = [...this.recipes];

    // Apply search filter
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(recipe => 
        recipe.name.toLowerCase().includes(search) ||
        recipe.type.toLowerCase().includes(search) ||
        recipe.cuisine.toLowerCase().includes(search)
      );
    }

    // Apply type filter - check if selected type exists in recipe's types
    if (this.selectedType) {
      filtered = filtered.filter(recipe => {
        if (!recipe.type) return false;
        
        let types: string[] = [];
        if (Array.isArray(recipe.type)) {
          types = recipe.type.filter(t => t && typeof t === 'string');
        } else if (typeof recipe.type === 'string') {
          types = recipe.type.split(',').map(t => t.trim());
        } else {
          types = [String(recipe.type)];
        }
        
        return types.includes(this.selectedType);
      });
    }

    // Apply cuisine filter - check if selected cuisine exists in recipe's cuisines
    if (this.selectedCuisine) {
      filtered = filtered.filter(recipe => {
        if (!recipe.cuisine) return false;
        
        let cuisines: string[] = [];
        if (Array.isArray(recipe.cuisine)) {
          cuisines = recipe.cuisine.filter(c => c && typeof c === 'string');
        } else if (typeof recipe.cuisine === 'string') {
          cuisines = recipe.cuisine.split(',').map(c => c.trim());
        } else {
          cuisines = [String(recipe.cuisine)];
        }
        
        return cuisines.includes(this.selectedCuisine);
      });
    }

    this.filteredRecipes = filtered;
  }

  clearAllFilters() {
    this.searchTerm = '';
    this.selectedType = '';
    this.selectedCuisine = '';
    this.applyFilters();
  }

  onRecipeSelect(recipe: Recipe) {
    console.log('Recipe selected:', recipe.name);
    this.recipeSelected.emit(recipe);
  }

  onEditRecipe(recipe: Recipe) {
    console.log('Edit recipe clicked:', recipe.name);
    this.editRecipe.emit(recipe);
  }

  onViewIngredients(recipe: Recipe) {
    console.log('View ingredients clicked:', recipe.name);
    this.viewIngredients.emit(recipe);
  }

  isRecipeSelected(recipe: Recipe): boolean {
    return this.selectedRecipes.some(selected => selected.name === recipe.name);
  }
}