import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-grocery-add-modal',
  templateUrl: './grocery-add-modal.component.html',
  styleUrl: './grocery-add-modal.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule, InputTextModule, Select]
})
export class GroceryAddModalComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() itemAdded = new EventEmitter<{ name: string; type: string }>();

  newItem = {
    name: '',
    type: ''
  };

  typeOptions = [
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

  onCancel() {
    this.resetForm();
    this.visible = false;
    this.visibleChange.emit(false);
  }

  onSave() {
    if (this.newItem.name.trim() && this.newItem.type) {
      this.itemAdded.emit({
        name: this.newItem.name.trim(),
        type: this.newItem.type
      });
      this.resetForm();
      this.visible = false;
      this.visibleChange.emit(false);
    }
  }

  resetForm() {
    this.newItem = {
      name: '',
      type: ''
    };
  }

  isFormValid(): boolean {
    return this.newItem.name.trim().length > 0 && this.newItem.type.length > 0;
  }
}
