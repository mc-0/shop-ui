

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RecipeTableComponent } from './components/recipe-table/recipe-table.component';
import { ShoppingListComponent } from './components/shopping-list/shopping-list.component';
import { RecipeEditModalComponent } from './components/recipe-edit-modal/recipe-edit-modal.component';
import { IngredientsModalComponent } from './components/ingredients-modal/ingredients-modal.component';
import { RecipeService, Recipe } from './services/recipe.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.css',
  standalone: true,
  imports: [CommonModule, ButtonModule, RecipeTableComponent, ShoppingListComponent, RecipeEditModalComponent, IngredientsModalComponent]
})
export class App implements OnInit {
  recipes: Recipe[] = [];
  selectedRecipes: Recipe[] = [];
  showEditModal: boolean = false;
  editingRecipe: Recipe | null = null;
  showIngredientsModal: boolean = false;
  viewingRecipe: Recipe | null = null;

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.loadRecipes();
  }

  loadRecipes() {
    this.recipeService.getAllRecipes().subscribe({
      next: (recipes) => {
        this.recipes = recipes;
      },
      error: (error) => {
        console.error('Error loading recipes:', error);
      }
    });
  }

  onRecipeSelected(recipe: Recipe) {
    const index = this.selectedRecipes.findIndex(r => r.name === recipe.name);
    if (index === -1) {
      this.selectedRecipes.push(recipe);
    }
  }

  onEditRecipe(recipe: Recipe) {
    console.log('App received edit recipe event:', recipe.name);
    this.editingRecipe = recipe;
    this.showEditModal = true;
    console.log('Modal should be visible:', this.showEditModal);
  }

  onViewIngredients(recipe: Recipe) {
    console.log('View ingredients event:', recipe.name);
    this.viewingRecipe = recipe;
    this.showIngredientsModal = true;
  }

  onRecipeSaved(updatedRecipe: Recipe) {
    this.recipeService.updateRecipe(updatedRecipe).subscribe({
      next: (result) => {
        // Update the recipe in the local array
        const index = this.recipes.findIndex(r => r.name === updatedRecipe.name);
        if (index !== -1) {
          this.recipes[index] = updatedRecipe;
        }
        
        // Update in selected recipes if it exists there
        const selectedIndex = this.selectedRecipes.findIndex(r => r.name === updatedRecipe.name);
        if (selectedIndex !== -1) {
          this.selectedRecipes[selectedIndex] = updatedRecipe;
        }
      },
      error: (error) => {
        console.error('Error updating recipe:', error);
      }
    });
  }
}

