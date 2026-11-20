import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CartItem } from '@app/core';

/**
 * Dumb Presentational Component
 * Displays a single row in the cart; emits removal action upwards.
 */
@Component({
  selector: 'app-cart-item-row',
  imports: [CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cart-row">
      <div class="product-info">
        <h4 class="name">{{ item().product.name }}</h4>
        <span class="unit-price">{{ item().product.price | currency:'USD' }} each</span>
      </div>

      <div class="qty-badge">Qty: {{ item().quantity }}</div>

      <div class="total-price">
        {{ item().product.price * item().quantity | currency:'USD' }}
      </div>

      <button type="button" class="btn-remove" (click)="onRemoveClick()">
        ✕
      </button>
    </div>
  `,
  styles: [`
    .cart-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
    }
    .product-info {
      flex: 1;
    }
    .name {
      margin: 0;
      font-size: 0.95rem;
      color: #0f172a;
    }
    .unit-price {
      font-size: 0.8rem;
      color: #64748b;
    }
    .qty-badge {
      background: #f1f5f9;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 0.85rem;
      font-weight: 600;
      margin: 0 16px;
    }
    .total-price {
      font-weight: 700;
      color: #0f172a;
      min-width: 80px;
      text-align: right;
    }
    .btn-remove {
      background: none;
      border: none;
      color: #ef4444;
      font-size: 1rem;
      cursor: pointer;
      padding: 4px 8px;
      margin-left: 12px;
      border-radius: 4px;
    }
    .btn-remove:hover {
      background: #fee2e2;
    }
  `]
})
export class CartItemRowComponent {
  readonly item = input.required<CartItem>();
  readonly remove = output<string>();

  onRemoveClick(): void {
    this.remove.emit(this.item().product.id);
  }
}
