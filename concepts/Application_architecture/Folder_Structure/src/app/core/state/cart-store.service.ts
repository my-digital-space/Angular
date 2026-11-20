import { Injectable, signal, computed } from '@angular/core';

export interface CartProduct {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
}

/**
 * Enterprise Cross-Feature Cart Store (Core Singleton)
 *
 * Professional Architecture Principle:
 * When multiple independent features (e.g. Products, Cart, Header shell)
 * need to share and mutate the same reactive state, that state is elevated
 * to an app-level or cross-feature Core Store.
 *
 * Neither feature imports the other; both depend on this shared core contract.
 */
@Injectable({
  providedIn: 'root'
})
export class CartStoreService {
  private readonly itemsState = signal<CartItem[]>([
    {
      product: { id: 'PROD-101', name: 'Cloud Enterprise License', price: 1200 },
      quantity: 1
    }
  ]);

  // Read-only signals exposed to features
  readonly items = this.itemsState.asReadonly();

  readonly totalItemCount = computed(() =>
    this.itemsState().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly subtotal = computed(() =>
    this.itemsState().reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  );

  addToCart(product: CartProduct): void {
    this.itemsState.update((current) => {
      const existing = current.find((i) => i.product.id === product.id);
      if (existing) {
        return current.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...current, { product, quantity: 1 }];
    });
  }

  removeItem(productId: string): void {
    this.itemsState.update((current) => current.filter((i) => i.product.id !== productId));
  }

  clearCart(): void {
    this.itemsState.set([]);
  }
}
