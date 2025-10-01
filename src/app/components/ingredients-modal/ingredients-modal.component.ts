import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Recipe } from '../../services/recipe.service';

@Component({
  selector: 'app-ingredients-modal',
  templateUrl: './ingredients-modal.component.html',
  styleUrl: './ingredients-modal.component.css',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule]
})
export class IngredientsModalComponent {
  @Input() visible: boolean = false;
  @Input() recipe: Recipe | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();

  onClose() {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}