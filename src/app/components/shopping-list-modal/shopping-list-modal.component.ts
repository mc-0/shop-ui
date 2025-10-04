import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

interface IngredientWithStore {
  name: string;
  store: string | null;
}

type Store = 'M' | 'BJ' | 'FT' | 'P';

const STORE_NAMES: Record<Store, string> = {
  'M': 'Meijer',
  'BJ': "BJ's",
  'FT': 'Fresh Thyme',
  'P': 'Papaya'
};

@Component({
  selector: 'app-shopping-list-modal',
  templateUrl: './shopping-list-modal.component.html',
  styleUrl: './shopping-list-modal.component.css',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, TextareaModule, ToastModule],
  providers: [MessageService]
})
export class ShoppingListModalComponent implements OnChanges {
  @Input() visible: boolean = false;
  @Input() shoppingList: string = '';
  @Output() visibleChange = new EventEmitter<boolean>();

  ingredients: IngredientWithStore[] = [];
  showStoreSelection: boolean = true;
  finalShoppingList: string = '';
  stores: Store[] = ['M', 'BJ', 'FT', 'P'];
  storeNames = STORE_NAMES;

  constructor(private messageService: MessageService) {}

  ngOnChanges() {
    if (this.visible && this.shoppingList) {
      this.parseIngredients();
      this.showStoreSelection = true;
    }
  }

  private parseIngredients() {
    // Parse the shopping list string into individual ingredients
    const lines = this.shoppingList.split('\n')
      .map(line => line.trim())
      .filter(line => line && line.startsWith('-'));

    this.ingredients = lines.map(line => ({
      name: line.substring(1).trim(), // Remove the '-' prefix
      store: null
    }));
  }

  selectStore(ingredient: IngredientWithStore, store: Store) {
    ingredient.store = store;
  }

  removeIngredient(ingredient: IngredientWithStore) {
    const index = this.ingredients.indexOf(ingredient);
    if (index > -1) {
      this.ingredients.splice(index, 1);
    }
  }

  generateShoppingList() {
    // Group ingredients by store
    const ingredientsByStore: Record<string, string[]> = {};
    const noStoreIngredients: string[] = [];

    this.ingredients.forEach(ingredient => {
      if (ingredient.store) {
        const storeName = STORE_NAMES[ingredient.store as Store];
        if (!ingredientsByStore[storeName]) {
          ingredientsByStore[storeName] = [];
        }
        ingredientsByStore[storeName].push(ingredient.name);
      } else {
        noStoreIngredients.push(ingredient.name);
      }
    });

    // Build the formatted shopping list
    let formattedList = '';

    // Add ingredients grouped by store
    Object.keys(ingredientsByStore).forEach(storeName => {
      formattedList += `* ${storeName} *\n`;
      ingredientsByStore[storeName].forEach(item => {
        formattedList += `- ${item}\n`;
      });
      formattedList += '\n';
    });

    // Add ingredients without a store (no header)
    if (noStoreIngredients.length > 0) {
      noStoreIngredients.forEach(item => {
        formattedList += `- ${item}\n`;
      });
    }

    this.finalShoppingList = formattedList.trim();
    this.showStoreSelection = false;
  }

  onClose() {
    this.visible = false;
    this.visibleChange.emit(false);
    // Reset state when closing
    this.showStoreSelection = true;
    this.finalShoppingList = '';
    this.ingredients = [];
  }

  async copyToClipboard() {
    await this.copyText(this.finalShoppingList, 'Shopping list copied to clipboard');
  }

  private async copyText(text: string, successMessage: string) {
    try {
      await navigator.clipboard.writeText(text);
      this.messageService.add({
        severity: 'success',
        summary: 'Copied!',
        detail: successMessage,
        life: 4000
      });
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      this.fallbackCopyToClipboard(text, successMessage);
    }
  }

  private fallbackCopyToClipboard(text: string, successMessage: string) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      this.messageService.add({
        severity: 'success',
        summary: 'Copied!',
        detail: successMessage,
        life: 4000
      });
    } catch (err) {
      this.messageService.add({
        severity: 'error',
        summary: 'Copy Failed',
        detail: 'Unable to copy to clipboard',
        life: 3000
      });
    } finally {
      document.body.removeChild(textArea);
    }
  }
}