import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { CartStoreService } from '@app/core';
import { CartItemRowComponent } from '../ui/cart-item-row.component';

/**
 * Smart Container Component (Cart Page)
 *
 * Demonstrates:
 * 1. Consuming shared Core store state (CartStoreService) populated by Products feature.
 * 2. Navigating to Orders feature with route parameters (Pattern 1).
 */
@Component({
  selector: 'app-cart-page',
  imports: [CurrencyPipe, CartItemRowComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="cart-page">
      <header class="page-header">
        <h2>Your Shopping Cart</h2>
        <p class="description">
          Cross-Feature State: This cart reflects items added from <code>features/products/</code> via <code>core/state/cart-store</code>.
        </p>
      </header>

      <div class="cart-layout">
        <div class="items-column">
          @for (item of cartStore.items(); track item.product.id) {
            <app-cart-item-row
              [item]="item"
              (remove)="handleRemove($event)"
            />
          } @empty {
            <div class="empty-cart">
              <p>Your cart is currently empty.</p>
            </div>
          }
        </div>

        @if (cartStore.items().length > 0) {
          <div class="summary-card">
            <h3>Order Summary</h3>
            <div class="summary-line">
              <span>Items ({{ cartStore.totalItemCount() }}):</span>
              <span>{{ cartStore.subtotal() | currency:'USD' }}</span>
            </div>
            <div class="summary-line">
              <span>Estimated Tax (10%):</span>
              <span>{{ estimatedTax() | currency:'USD' }}</span>
            </div>
            <div class="summary-line total-line">
              <strong>Order Total:</strong>
              <strong>{{ totalAmount() | currency:'USD' }}</strong>
            </div>

            <button type="button" class="btn-checkout" (click)="proceedToCheckout()">
              Proceed to Orders →
            </button>
            <button type="button" class="btn-clear" (click)="cartStore.clearCart()">
              Clear Cart
            </button>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .cart-page {
      max-width: 860px;
      margin: 0 auto;
    }
    .page-header {
      margin-bottom: 24px;
    }
    .page-header h2 {
      margin: 0 0 4px 0;
      color: #0f172a;
    }
    .description {
      margin: 0;
      color: #64748b;
      font-size: 0.9rem;
    }
    .cart-layout {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 24px;
      align-items: start;
    }
    @media (max-width: 768px) {
      .cart-layout {
        grid-template-columns: 1fr;
      }
    }
    .items-column {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .empty-cart {
      background: white;
      border: 1px dashed #cbd5e1;
      padding: 32px;
      text-align: center;
      border-radius: 8px;
      color: #94a3b8;
    }
    .summary-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .summary-card h3 {
      margin: 0 0 8px 0;
      font-size: 1.1rem;
      color: #0f172a;
    }
    .summary-line {
      display: flex;
      justify-content: space-between;
      color: #475569;
      font-size: 0.9rem;
    }
    .total-line {
      margin-top: 8px;
      padding-top: 10px;
      border-top: 1px dashed #cbd5e1;
      color: #0f172a;
      font-size: 1.05rem;
    }
    .btn-checkout {
      background: #16a34a;
      color: white;
      border: none;
      padding: 10px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 8px;
    }
    .btn-checkout:hover {
      background: #15803d;
    }
    .btn-clear {
      background: transparent;
      border: 1px solid #e2e8f0;
      color: #64748b;
      padding: 8px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.85rem;
    }
    .btn-clear:hover {
      background: #f1f5f9;
    }
  `]
})
export class CartPageComponent {
  protected readonly cartStore = inject(CartStoreService);
  private readonly router = inject(Router);

  protected readonly estimatedTax = computed(() => this.cartStore.subtotal() * 0.1);
  protected readonly totalAmount = computed(() => this.cartStore.subtotal() + this.estimatedTax());

  handleRemove(productId: string): void {
    this.cartStore.removeItem(productId);
  }

  proceedToCheckout(): void {
    // Cross-Feature Data Flow: Route navigation with parameter
    this.router.navigate(['/orders'], {
      queryParams: { source: 'cart' }
    });
  }
}
