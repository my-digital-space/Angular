import { Injectable, signal } from '@angular/core';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartItemsService {
  private readonly _items = signal<CartItem[]>([
    { id: 1, name: 'Mechanical Keyboard (RGB)', price: 6000, quantity: 1 },
    { id: 2, name: 'USB-C Docking Station', price: 2400, quantity: 1 },
    { id: 3, name: 'Ergonomic Mousepad', price: 800, quantity: 2 }
  ]);

  readonly items = this._items.asReadonly();

  addItem(name: string, price: number): void {
    const newItem: CartItem = {
      id: Date.now(),
      name,
      price,
      quantity: 1
    };
    this._items.update(list => [...list, newItem]);
  }

  removeItem(id: number): void {
    this._items.update(list => list.filter(item => item.id !== id));
  }

  incrementQuantity(id: number): void {
    this._items.update(list =>
      list.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item)
    );
  }

  decrementQuantity(id: number): void {
    this._items.update(list =>
      list.map(item => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity - 1);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  }

  reset(): void {
    this._items.set([
      { id: 1, name: 'Mechanical Keyboard (RGB)', price: 6000, quantity: 1 },
      { id: 2, name: 'USB-C Docking Station', price: 2400, quantity: 1 }
    ]);
  }
}
