import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ShoppingListModalComponent } from '../shopping-list-modal/shopping-list-modal.component';
import { Recipe } from '../../services/recipe.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.css',
  standalone: true,
  imports: [CommonModule, ButtonModule, ShoppingListModalComponent]
})
export class ShoppingListComponent {
  @Input() selectedRecipes: Recipe[] = [];
  showShoppingListModal: boolean = false;
  shoppingList: string = '';

  removeRecipe(recipe: Recipe) {
    const index = this.selectedRecipes.findIndex(r => r.name === recipe.name);
    if (index > -1) {
      this.selectedRecipes.splice(index, 1);
    }
  }

  generateShoppingList() {
    const allIngredients: string[] = [];
    this.selectedRecipes.forEach(recipe => {
      if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
        allIngredients.push(...recipe.ingredients);
      }
    });

    const uniqueIngredients = [...new Set(allIngredients.map(i => i.toLowerCase()))]
      .sort()
      .map(ingredient => ingredient.charAt(0).toUpperCase() + ingredient.slice(1));

    this.shoppingList = uniqueIngredients.map(i => `- ${i}`).join('\n');
    this.showShoppingListModal = true;
  }
}