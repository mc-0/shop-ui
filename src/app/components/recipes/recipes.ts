import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RecipeTableComponent } from '../recipe-table/recipe-table.component';
import { RecipeEditModalComponent } from '../recipe-edit-modal/recipe-edit-modal.component';
import { IngredientsModalComponent } from '../ingredients-modal/ingredients-modal.component';
import { RecipeService, Recipe } from '../../services/recipe.service';

@Component({
  selector: 'app-recipes',
  imports: [CommonModule, ButtonModule, RecipeTableComponent, RecipeEditModalComponent, IngredientsModalComponent],
  templateUrl: './recipes.html',
  styleUrl: './recipes.css'
})
export class Recipes implements OnInit {
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
        const index = this.recipes.findIndex(r => r.name === updatedRecipe.name);
        if (index !== -1) {
          this.recipes[index] = updatedRecipe;
        }

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
