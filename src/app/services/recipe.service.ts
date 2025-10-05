import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Recipe {
  id: string;
  name: string;
  type: string;
  cuisine: string;
  lastEaten: string;
  ingredients: string[];
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'http://192.168.1.93:8080/recipes';

  constructor(private http: HttpClient) {}

  getAllRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}`);
  }

  updateRecipe(recipe: Recipe): Observable<Recipe> {
    // This would typically make an HTTP PUT request to update the recipe
    // For now, we'll just console.log and return the recipe
    console.log('Recipe updated/saved', recipe);
    return this.http.put<Recipe>(`${this.apiUrl}` + '/' + recipe.id, recipe);
  }
}
