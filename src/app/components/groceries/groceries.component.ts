import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { GroceryTableComponent } from '../grocery-table/grocery-table.component';
import { GroceryAddModalComponent } from '../grocery-add-modal/grocery-add-modal.component';
import { GroceryDeleteModalComponent } from '../grocery-delete-modal/grocery-delete-modal.component';
import { GroceryService, GroceryItem } from '../../services/grocery.service';

@Component({
  selector: 'app-groceries',
  imports: [CommonModule, ButtonModule, GroceryTableComponent, GroceryAddModalComponent, GroceryDeleteModalComponent],
  templateUrl: './groceries.component.html',
  styleUrl: './groceries.component.css'
})
export class GroceriesComponent implements OnInit {
  groceries: GroceryItem[] = [];
  selectedGroceries: GroceryItem[] = [];
  showAddModal: boolean = false;
  showDeleteModal: boolean = false;
  deletingGrocery: GroceryItem | null = null;

  constructor(private groceryService: GroceryService) {}

  ngOnInit() {
    this.loadGroceries();
  }

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
    const index = this.selectedGroceries.findIndex(g => g.id === grocery.id);
    if (index === -1) {
      this.selectedGroceries = [...this.selectedGroceries, grocery];
    }
  }

  onDeleteGrocery(grocery: GroceryItem) {
    this.deletingGrocery = grocery;
    this.showDeleteModal = true;
  }

  onConfirmDelete(grocery: GroceryItem) {
    this.groceryService.deleteGrocery(grocery.id).subscribe({
      next: () => {
        this.groceries = this.groceries.filter(g => g.id !== grocery.id);
        this.selectedGroceries = this.selectedGroceries.filter(g => g.id !== grocery.id);
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
}
