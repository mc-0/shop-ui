import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ShoppingListModalComponent } from '../shopping-list-modal/shopping-list-modal.component';
import { SelectionService, SelectionItem } from '../../services/selection.service';

type Store = 'M' | 'BJ' | 'FT' | 'P';

const STORE_NAMES: Record<Store, string> = {
  'M': 'Meijer',
  'BJ': "BJ's",
  'FT': 'Fresh Thyme',
  'P': 'Papaya'
};

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.css',
  standalone: true,
  imports: [CommonModule, ButtonModule, ShoppingListModalComponent]
})
export class ShoppingListComponent {
  @Input() selectedRecipes: SelectionItem[] = [];
  showShoppingListModal: boolean = false;
  finalShoppingList: string = '';
  stores: Store[] = ['M', 'BJ', 'FT', 'P'];
  storeNames = STORE_NAMES;

  constructor(private selectionService: SelectionService) {}

  removeItem(item: SelectionItem) {
    this.selectionService.removeItem(item.name);
  }

  clearAll() {
    this.selectionService.clearAll();
  }

  selectStore(item: SelectionItem, store: Store) {
    this.selectionService.setStore(item.name, store);
  }

  generateShoppingList() {
    // Group items by store
    const itemsByStore: Record<string, string[]> = {};
    const noStoreItems: string[] = [];

    this.selectedRecipes.forEach(item => {
      if (item.store) {
        const storeName = STORE_NAMES[item.store as Store];
        if (!itemsByStore[storeName]) {
          itemsByStore[storeName] = [];
        }
        itemsByStore[storeName].push(item.name);
      } else {
        noStoreItems.push(item.name);
      }
    });

    // Build the formatted shopping list
    let formattedList = '';

    // Add items grouped by store
    Object.keys(itemsByStore).forEach(storeName => {
      formattedList += `* ${storeName} *\n`;
      itemsByStore[storeName].forEach(item => {
        formattedList += `${item}\n`;
      });
      formattedList += '\n';
    });

    // Add items without a store (no header)
    if (noStoreItems.length > 0) {
      noStoreItems.forEach(item => {
        formattedList += `${item}\n`;
      });
    }

    this.finalShoppingList = formattedList.trim();
    this.showShoppingListModal = true;
  }
}