import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { GroceryItem } from '../../services/grocery.service';

@Component({
  selector: 'app-grocery-delete-modal',
  templateUrl: './grocery-delete-modal.component.html',
  styleUrl: './grocery-delete-modal.component.css',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule]
})
export class GroceryDeleteModalComponent {
  @Input() visible: boolean = false;
  @Input() grocery: GroceryItem | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() confirmDelete = new EventEmitter<GroceryItem>();

  onCancel() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  onConfirm() {
    if (this.grocery) {
      this.confirmDelete.emit(this.grocery);
    }
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
