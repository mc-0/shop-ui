import { Routes } from '@angular/router';
import { Landing } from './components/landing/landing';
import { Recipes } from './components/recipes/recipes';
import { Grocery } from './components/grocery/grocery';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'recipes', component: Recipes },
  { path: 'grocery', component: Grocery }
];
