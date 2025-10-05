import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { Recipe } from '../../services/recipe.service';

@Component({
  selector: 'app-recipe-edit-modal',
  templateUrl: './recipe-edit-modal.component.html',
  styleUrl: './recipe-edit-modal.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule, InputTextModule, TextareaModule, DatePickerModule]
})
export class RecipeEditModalComponent implements OnChanges {
  @Input() visible: boolean = false;
  @Input() recipe: Recipe | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() recipeSaved = new EventEmitter<Recipe>();

  editedRecipe: Recipe = {
    id: '',
    name: '',
    type: '',
    cuisine: '',
    lastEaten: '',
    ingredients: [],
    url: ''
  };

  ingredientsText: string = '';
  lastEatenDate: Date | null = null;

  ngOnChanges() {
    console.log('Modal ngOnChanges - visible:', this.visible, 'recipe:', this.recipe?.name);
    if (this.recipe) {
      this.editedRecipe = { ...this.recipe };
      this.ingredientsText = Array.isArray(this.recipe.ingredients)
        ? this.recipe.ingredients.join('\n')
        : '';
      // Convert string date to Date object
      this.lastEatenDate = this.recipe.lastEaten ? new Date(this.recipe.lastEaten) : null;
    }
  }

  onCancel() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  onSave() {
    // Convert ingredients text back to array
    this.editedRecipe.ingredients = this.ingredientsText
      .split('\n')
      .map(ingredient => ingredient.trim())
      .filter(ingredient => ingredient.length > 0);

    // Convert Date object back to string
    if (this.lastEatenDate) {
      this.editedRecipe.lastEaten = this.lastEatenDate.toISOString();
    }

    this.recipeSaved.emit(this.editedRecipe);
    console.log('Recipe updated/saved', this.editedRecipe);

    this.visible = false;
    this.visibleChange.emit(false);
  }
}
