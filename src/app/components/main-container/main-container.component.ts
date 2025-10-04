import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RecipeTableComponent } from '../recipe-table/recipe-table.component';
import { GroceryTableComponent } from '../grocery-table/grocery-table.component';
import { ShoppingListComponent } from '../shopping-list/shopping-list.component';
import { RecipeEditModalComponent } from '../recipe-edit-modal/recipe-edit-modal.component';
import { IngredientsModalComponent } from '../ingredients-modal/ingredients-modal.component';
import { GroceryAddModalComponent } from '../grocery-add-modal/grocery-add-modal.component';
import { GroceryDeleteModalComponent } from '../grocery-delete-modal/grocery-delete-modal.component';
import { RecipeService, Recipe } from '../../services/recipe.service';
import { GroceryService, GroceryItem } from '../../services/grocery.service';
import { SelectionService, SelectionItem } from '../../services/selection.service';

@Component({
  selector: 'app-main-container',
  templateUrl: './main-container.component.html',
  styleUrl: './main-container.component.css',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    RecipeTableComponent,
    GroceryTableComponent,
    ShoppingListComponent,
    RecipeEditModalComponent,
    IngredientsModalComponent,
    GroceryAddModalComponent,
    GroceryDeleteModalComponent
  ]
})
export class MainContainerComponent implements OnInit {
  // Active tab
  activeTab: 'recipes' | 'groceries' = 'recipes';

  // Recipe data
  recipes: Recipe[] = [];
  selectedRecipes: Recipe[] = [];
  showEditModal: boolean = false;
  editingRecipe: Recipe | null = null;
  showIngredientsModal: boolean = false;
  viewingRecipe: Recipe | null = null;

  // Grocery data
  groceries: GroceryItem[] = [];
  showAddModal: boolean = false;
  showDeleteModal: boolean = false;
  deletingGrocery: GroceryItem | null = null;

  // Selection items for shopping list
  selectedItems: SelectionItem[] = [];

  constructor(
    private recipeService: RecipeService,
    private groceryService: GroceryService,
    private selectionService: SelectionService
  ) {}

  ngOnInit() {
    this.loadRecipes();
    this.loadGroceries();

    // Subscribe to selection changes
    this.selectionService.items$.subscribe(items => {
      this.selectedItems = items;

      // Update selected recipes based on current items
      // A recipe should only be selected if at least one of its ingredients is in the items list
      this.selectedRecipes = this.selectedRecipes.filter(recipe => {
        if (!recipe.ingredients || recipe.ingredients.length === 0) {
          return false;
        }
        // Check if any ingredient from this recipe is still in the items list
        return recipe.ingredients.some(ingredient =>
          items.some(item => item.name.toLowerCase() === ingredient.toLowerCase())
        );
      });
    });
  }

  // Recipe methods
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
    if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
      this.selectionService.addItems(recipe.ingredients);
      // Track the selected recipe
      if (!this.selectedRecipes.some(r => r.name === recipe.name)) {
        this.selectedRecipes.push(recipe);
      }
    }
  }

  onEditRecipe(recipe: Recipe) {
    this.editingRecipe = recipe;
    this.showEditModal = true;
  }

  onViewIngredients(recipe: Recipe) {
    this.viewingRecipe = recipe;
    this.showIngredientsModal = true;
  }

  onRecipeSaved(updatedRecipe: Recipe) {
    this.recipeService.updateRecipe(updatedRecipe).subscribe({
      next: () => {
        const index = this.recipes.findIndex(r => r.name === updatedRecipe.name);
        if (index !== -1) {
          this.recipes[index] = updatedRecipe;
        }
      },
      error: (error) => {
        console.error('Error updating recipe:', error);
      }
    });
  }

  // Grocery methods
  loadGroceries() {
    this.groceryService.getAllGroceries().subscribe({
      next: (groceries) => {
        this.groceries = groceries;
      },
      error: (error) => {
        console.error('Error loading groceries:', error);
      }
    });
  }

  onGrocerySelected(grocery: GroceryItem) {
    this.selectionService.addItem(grocery.name);
  }

  onDeleteGrocery(grocery: GroceryItem) {
    this.deletingGrocery = grocery;
    this.showDeleteModal = true;
  }

  onConfirmDelete(grocery: GroceryItem) {
    this.groceryService.deleteGrocery(grocery.id).subscribe({
      next: () => {
        this.groceries = this.groceries.filter(g => g.id !== grocery.id);
      },
      error: (error) => {
        console.error('Error deleting grocery:', error);
      }
    });
  }

  onItemAdded(newItem: { name: string; type: string }) {
    this.groceryService.addGrocery(newItem).subscribe({
      next: (addedItem) => {
        this.groceries.push(addedItem);
      },
      error: (error) => {
        console.error('Error adding grocery:', error);
      }
    });
  }

  openAddModal() {
    this.showAddModal = true;
  }

  switchTab(tab: 'recipes' | 'groceries') {
    this.activeTab = tab;
  }
}
