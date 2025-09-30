

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TableModule} from 'primeng/table';
import {Button, ButtonDirective} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-root',
  styleUrl: './app.css',
  standalone: true,
  imports: [CommonModule, HttpClientModule, TableModule, Button, ButtonDirective, InputText, TextareaModule],
  template: `<h1>Grocery Time!</h1>
  <!--@if (resp === undefined) {
    <h1>JABRONI</h1>
  } @else {
    @for (r of resp; track r.name) {
      <h4>{{r.name}}</h4>
    }
  }-->
  <button pButton type="button" label="Clear" (click)="dt.clear()" icon="pi pi-filter-slash"></button>
  <p-table [value]="resp" [globalFilterFields]="['name','type','cuisine','lastEaten','ingredients','url']" #dt>
    <ng-template pTemplate="header">
      <tr>
        <th>Recipe</th>
        <th>Type</th>
        <th>Cuisine</th>
        <th>Last Eaten</th>
        <th>Ingredients</th>
        <th>URL</th>
      </tr>
      <tr>
        <th>
          <input #nameInput pInputText type="text" (input)="dt.filter($event.target.value, 'name', 'contains')" placeholder="Search Recipe" />
        </th>
        <th>
          <input #typeInput pInputText type="text" (input)="dt.filter($event.target.value, 'type', 'contains')" placeholder="Search Type" />
        </th>
        <th>
          <input #cuisineInput pInputText type="text" (input)="dt.filter($event.target.value, 'cuisine', 'contains')" placeholder="Search Cuisine" />
        </th>
        <th>
          <input #lastEatenInput pInputText type="text" (input)="dt.filter($event.target.value, 'lastEaten', 'contains')" placeholder="Search Date" />
        </th>
        <th>
          <input #ingredientsInput pInputText type="text" (input)="dt.filter($event.target.value, 'ingredients', 'contains')" placeholder="Search Ingredients" />
        <th>
          <input #urlInput pInputText type="text" (input)="dt.filter($event.target.value, 'url', 'contains')" placeholder="Search URL" />
        </th>
      </tr>
    </ng-template>
    <ng-template pTemplate="body" let-recipe>
      <tr (click)="onRowClick(recipe)" style="cursor: pointer;">
        <td>{{recipe.name}}</td>
        <td>{{recipe.type}}</td>
        <td>{{recipe.cuisine}}</td>
        <td>{{recipe.lastEaten}}</td>
        <td>{{recipe.ingredients}}</td>
        <td>{{recipe.url}}</td>
      </tr>
    </ng-template>
  </p-table>
  <button (click)="testEndpoint()">BUH</button>

  <div style="margin-top: 2rem;">
    <h2>Selected Recipes ({{ selectedRecipes.length }})</h2>
    @if (selectedRecipes.length === 0) {
      <p>Click on a recipe row to add it to your list</p>
    } @else {
      <ul style="list-style: none; padding: 0;">
        @for (recipe of selectedRecipes; track recipe.name) {
          <li style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
            <span>{{ recipe.name }}</span>
            <button pButton type="button" label="Remove" (click)="removeRecipe(recipe)" icon="pi pi-times" size="small" severity="danger"></button>
          </li>
        }
      </ul>
      <button pButton type="button" label="Shop Now" (click)="generateShoppingList()" icon="pi pi-shopping-cart" style="margin-top: 1rem;" severity="success"></button>
    }
  </div>

  @if (showShoppingList) {
    <div style="margin-top: 2rem;">
      <h2>Shopping List</h2>
      <textarea pTextarea [value]="shoppingList" rows="15" cols="50" style="width: 100%; max-width: 600px; font-family: monospace;"></textarea>
    </div>
  }`
})
export class App {
  data: any = 'ZZZZZZZ'
  resp: any;
  selectedRecipes: any[] = [];
  showShoppingList: boolean = false;
  shoppingList: string = '';

  constructor(private http: HttpClient) {

  }

  public testEndpoint() {
    this.http.get('http://192.168.1.93:8080/recipes/all').subscribe((response) => {
      this.resp = response;
      console.log(response)
    });
  }

  public onRowClick(recipe: any) {
    // Check if recipe is already in the list
    const index = this.selectedRecipes.findIndex(r => r.name === recipe.name);
    if (index === -1) {
      // Add to list if not already there
      this.selectedRecipes.push(recipe);
    }
  }

  public removeRecipe(recipe: any) {
    this.selectedRecipes = this.selectedRecipes.filter(r => r.name !== recipe.name);
  }

  public generateShoppingList() {
    // Collect all ingredients from selected recipes
    const allIngredients: string[] = [];
    this.selectedRecipes.forEach(recipe => {
      if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
        allIngredients.push(...recipe.ingredients);
      }
    });

    // Remove duplicates (case-insensitive)
    const uniqueIngredients = [...new Set(allIngredients.map(i => i.toLowerCase()))]
      .sort()
      .map(ingredient => ingredient.charAt(0).toUpperCase() + ingredient.slice(1));

    // Join with newlines for display in textarea
    this.shoppingList = uniqueIngredients.join('\n');
    this.showShoppingList = true;
  }
}

