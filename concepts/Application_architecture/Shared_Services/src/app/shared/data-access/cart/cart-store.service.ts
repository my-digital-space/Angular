import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, of, tap } from 'rxjs';
import { CartItem, OrderReceipt } from './cart.model';
import { ToastService } from '../../../core/services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class CartStoreService {
  // Services can cleanly inject other shared services
  private readonly http = inject(HttpClient);
  private readonly toast = inject(ToastService);
  private readonly GST_RATE = 0.18;

  // 1. PRIVATE WRITABLE STATE (Encapsulated)
  private readonly itemsSignal = signal<CartItem[]>([
    { productId: 'PRD-01', name: 'Ergonomic Split Keyboard', unitPrice: 8500, quantity: 1 }
  ]);
  private readonly couponCodeSignal = signal<string | null>(null);
  private readonly isCheckingOutSignal = signal<boolean>(false);

  // 2. PUBLIC READ-ONLY SIGNALS
  readonly items = this.itemsSignal.asReadonly();
  readonly appliedCoupon = this.couponCodeSignal.asReadonly();
  readonly isCheckingOut = this.isCheckingOutSignal.asReadonly();

  // 3. DERIVED BUSINESS CALCULATIONS (Memoized automatically by computed())
  readonly totalItemCount = computed(() =>
    this.itemsSignal().reduce((total, item) => total + item.quantity, 0)
  );

  readonly subtotal = computed(() =>
    this.itemsSignal().reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  );

  readonly discountAmount = computed(() => {
    const code = this.couponCodeSignal();
    if (code === 'SAVE10') {
      return Math.round(this.subtotal() * 0.10);
    }
    return 0;
  });

  readonly taxableAmount = computed(() =>
    Math.max(0, this.subtotal() - this.discountAmount())
  );

  readonly gstAmount = computed(() =>
    Math.round(this.taxableAmount() * this.GST_RATE)
  );

  readonly grandTotal = computed(() =>
    this.taxableAmount() + this.gstAmount()
  );

  // 4. BUSINESS MUTATION METHODS
  addItem(product: Omit<CartItem, 'quantity'>): void {
    this.itemsSignal.update((currentItems) => {
      const existingIndex = currentItems.findIndex(
        (i) => i.productId === product.productId
      );
      if (existingIndex > -1) {
        // Increment quantity immutably
        return currentItems.map((item, idx) =>
          idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...currentItems, { ...product, quantity: 1 }];
    });
    this.toast.show(`Added "${product.name}" to cart`, 'success');
  }

  removeItem(productId: string): void {
    this.itemsSignal.update((current) =>
      current.filter((item) => item.productId !== productId)
    );
    this.toast.show('Item removed from cart', 'info');
  }

  applyCoupon(rawCode: string): boolean {
    const normalized = rawCode.trim().toUpperCase();
    if (normalized === 'SAVE10') {
      this.couponCodeSignal.set(normalized);
      this.toast.show('Coupon SAVE10 applied (10% off)', 'success');
      return true;
    }
    this.toast.show('Invalid promo code', 'error');
    return false;
  }

  submitOrder(): void {
    if (this.itemsSignal().length === 0 || this.isCheckingOutSignal()) {
      return;
    }

    this.isCheckingOutSignal.set(true);

    const payload = {
      items: this.itemsSignal(),
      coupon: this.couponCodeSignal(),
      totalPaid: this.grandTotal()
    };

    this.http
      .post<OrderReceipt>('/api/v1/checkout', payload)
      .pipe(
        tap((receipt) => {
          // Clear cart state upon successful order
          this.itemsSignal.set([]);
          this.couponCodeSignal.set(null);
          this.toast.show(`Order ${receipt.orderId} confirmed!`, 'success');
        }),
        catchError(() => {
          this.toast.show('Checkout failed. Please try again.', 'error');
          return of(null);
        }),
        finalize(() => this.isCheckingOutSignal.set(false))
      )
      .subscribe();
  }
}
