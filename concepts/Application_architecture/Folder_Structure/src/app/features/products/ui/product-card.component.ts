import { Component, ChangeDetectionStrategy, computed, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../data-access/product.model';
import { calculateDiscountedPrice } from '../util/product-discount.util';
import { StatusBadgeComponent } from '@app/shared';

/**
 * Dumb Presentational Component
 * Purely visual. Emits addToCart output; has zero knowledge of cart or orders feature!
 */
@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, StatusBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="product-card">
      <div class="card-top">
        <span class="category">{{ product().category }}</span>
        <app-status-badge [label]="product().inStock ? 'In Stock' : 'Out of Stock'" [variant]="product().inStock ? 'success' : 'danger'" />
      </div>

      <h3 class="product-name">{{ product().name }}</h3>

      <div class="price-block">
        @if (product().discountRate > 0) {
          <span class="original-price">{{ product().price | currency:'USD' }}</span>
          <strong class="final-price">{{ discountedPrice() | currency:'USD' }}</strong>
          <span class="discount-badge">{{ product().discountRate * 100 }}% OFF</span>
        } @else {
          <strong class="final-price">{{ product().price | currency:'USD' }}</strong>
        }
      </div>

      <div class="actions">
        <button
          type="button"
          class="btn-add"
          [disabled]="!product().inStock"
          (click)="onAddClick()"
        >
          Add to Cart 🛒
        </button>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .category {
      font-size: 0.75rem;
      text-transform: uppercase;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.05em;
    }
    .product-name {
      margin: 0;
      font-size: 1.1rem;
      color: #0f172a;
    }
    .price-block {
      display: flex;
      align-items: baseline;
      gap: 8px;
    }
    .original-price {
      text-decoration: line-through;
      color: #94a3b8;
      font-size: 0.9rem;
    }
    .final-price {
      font-size: 1.25rem;
      color: #0f172a;
    }
    .discount-badge {
      background: #fef2f2;
      color: #ef4444;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .actions {
      margin-top: auto;
      display: flex;
      justify-content: flex-end;
    }
    .btn-add {
      background: #0284c7;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s ease;
    }
    .btn-add:hover:not(:disabled) {
      background: #0369a1;
    }
    .btn-add:disabled {
      background: #cbd5e1;
      cursor: not-allowed;
    }
  `]
})
export class ProductCardComponent {
  readonly product = input.required<Product>();
  readonly addToCart = output<Product>();

  protected readonly discountedPrice = computed(() =>
    calculateDiscountedPrice(this.product().price, this.product().discountRate)
  );

  onAddClick(): void {
    this.addToCart.emit(this.product());
  }
}
