import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface SelectionItem {
  name: string;
  store: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class SelectionService {
  private itemsSubject = new BehaviorSubject<SelectionItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  getItems(): SelectionItem[] {
    return this.itemsSubject.value;
  }

  addItem(name: string) {
    const currentItems = this.itemsSubject.value;
    // Check if item already exists (case-insensitive)
    const exists = currentItems.some(item =>
      item.name.toLowerCase() === name.toLowerCase()
    );

    if (!exists) {
      this.itemsSubject.next([...currentItems, { name, store: null }]);
    }
  }

  addItems(names: string[]) {
    const currentItems = this.itemsSubject.value;
    const newItems: SelectionItem[] = [];

    names.forEach(name => {
      const exists = currentItems.some(item =>
        item.name.toLowerCase() === name.toLowerCase()
      ) || newItems.some(item =>
        item.name.toLowerCase() === name.toLowerCase()
      );

      if (!exists) {
        newItems.push({ name, store: null });
      }
    });

    if (newItems.length > 0) {
      this.itemsSubject.next([...currentItems, ...newItems]);
    }
  }

  removeItem(name: string) {
    const currentItems = this.itemsSubject.value;
    this.itemsSubject.next(currentItems.filter(item => item.name !== name));
  }

  setStore(name: string, store: string) {
    const currentItems = this.itemsSubject.value;
    const updatedItems = currentItems.map(item =>
      item.name === name ? { ...item, store } : item
    );
    this.itemsSubject.next(updatedItems);
  }

  clearAll() {
    this.itemsSubject.next([]);
  }
}
