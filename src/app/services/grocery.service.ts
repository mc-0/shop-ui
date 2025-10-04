import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GroceryItem {
  id: string;
  name: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class GroceryService {
  private apiUrl = 'http://192.168.1.93:8080/groceries';

  constructor(private http: HttpClient) {}

  getAllGroceries(): Observable<GroceryItem[]> {
    return this.http.get<GroceryItem[]>(`${this.apiUrl}`);
  }

  addGrocery(grocery: { name: string; type: string }): Observable<GroceryItem> {
    return this.http.post<GroceryItem>(`${this.apiUrl}`, grocery);
  }

  deleteGrocery(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
