import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { GroceryItem } from '../../services/grocery.service';

@Component({
  selector: 'app-grocery-table',
  templateUrl: './grocery-table.component.html',
  styleUrl: './grocery-table.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, Select, TooltipModule]
})
export class GroceryTableComponent {
  @Input() groceries: GroceryItem[] = [];
  @Input() selectedGroceries: GroceryItem[] = [];
  @Output() grocerySelected = new EventEmitter<GroceryItem>();
  @Output() deleteGrocery = new EventEmitter<GroceryItem>();

  // Filtering properties
  filteredGroceries: GroceryItem[] = [];
  searchTerm: string = '';
  selectedType: string = '';

  // Dropdown options
  typeOptions: {label: string, value: string}[] = [
    { label: 'Fruit', value: 'fruit' },
    { label: 'Vegetable', value: 'vegetable' },
    { label: 'Meat', value: 'meat' },
    { label: 'Home Goods', value: 'home goods' },
    { label: 'Grain', value: 'grain' },
    { label: 'Legume', value: 'legume' },
    { label: 'Nuts/Seeds', value: 'nuts/seeds' },
    { label: 'Condiments', value: 'condiments' },
    { label: 'Seafood', value: 'seafood' }
  ];

  ngOnChanges() {
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.groceries];

    // Apply search filter
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(grocery =>
        grocery.name.toLowerCase().includes(search) ||
        grocery.type.toLowerCase().includes(search)
      );
    }

    // Apply type filter
    if (this.selectedType) {
      filtered = filtered.filter(grocery => grocery.type === this.selectedType);
    }

    this.filteredGroceries = filtered;
  }

  clearAllFilters() {
    this.searchTerm = '';
    this.selectedType = '';
    this.applyFilters();
  }

  onGrocerySelect(grocery: GroceryItem) {
    this.grocerySelected.emit(grocery);
  }

  onDeleteGrocery(grocery: GroceryItem) {
    this.deleteGrocery.emit(grocery);
  }

  isGrocerySelected(grocery: GroceryItem): boolean {
    return this.selectedGroceries.some(selected => selected.id === grocery.id);
  }
}
