import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing {
  constructor(private router: Router) {}

  navigateToRecipes() {
    this.router.navigate(['/recipes']);
  }

  navigateToGrocery() {
    this.router.navigate(['/grocery']);
  }

  navigateToGroceries() {
    this.router.navigate(['/groceries']);
  }
}
