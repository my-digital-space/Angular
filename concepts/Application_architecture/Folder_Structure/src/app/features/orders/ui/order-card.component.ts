import { Component, ChangeDetectionStrategy, computed, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Order } from '../data-access/order.model';
import { calculateFinalOrderTotal } from '../util/order-price.util';
import { StatusBadgeComponent, BadgeVariant } from '@app/shared';

/**
 * Dumb Presentational Component
 * - Purely visual: receives data via signal input() and emits events via output()
 * - Strictly NO service injections
 * - Fast to test and easily reusable
 */
@Component({
  selector: 'app-order-card',
  imports: [CurrencyPipe, StatusBadgeComponent],
  // OnPush ensures Angular only re-renders this card when its inputs change
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="order-card">
      <div class="card-header">
        <div>
          <span class="order-id">{{ order().id }}</span>
          <h3 class="customer-name">{{ order().customerName }}</h3>
        </div>
        <app-status-badge [label]="order().status" [variant]="statusVariant()" />
      </div>

      <div class="card-body">
        <div class="metric-row">
          <span>Subtotal:</span>
          <span>{{ order().subtotal | currency:'INR':'symbol':'1.2-2' }}</span>
        </div>
        <div class="metric-row">
          <span>Tax Rate:</span>
          <span>{{ order().taxRate * 100 }}%</span>
        </div>
        <div class="metric-row total-row">
          <strong>Total (incl. tax):</strong>
          <strong>{{ totalAmount() | currency:'INR':'symbol':'1.2-2' }}</strong>
        </div>
      </div>

      <div class="card-actions">
        @if (order().status !== 'DELIVERED') {
          <button type="button" class="btn-action" (click)="onCompleteClick()">
            Mark as Delivered
          </button>
        } @else {
          <span class="completed-tag">✓ Completed</span>
        }
      </div>
    </div>
  `,
  styles: [`
    .order-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 18px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      transition: all 0.2s ease;
    }
    .order-card:hover {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.08);
      border-color: #cbd5e1;
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 12px;
      margin-bottom: 12px;
    }
    .order-id {
      font-size: 0.75rem;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.06em;
    }
    .customer-name {
      margin: 4px 0 0 0;
      font-size: 1.1rem;
      color: #0f172a;
    }
    .card-body {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .metric-row {
      display: flex;
      justify-content: space-between;
      color: #475569;
      font-size: 0.9rem;
    }
    .total-row {
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px dashed #e2e8f0;
      color: #0f172a;
      font-size: 1rem;
    }
    .card-actions {
      margin-top: 14px;
      display: flex;
      justify-content: flex-end;
    }
    .btn-action {
      background-color: #0284c7;
      color: #ffffff;
      border: none;
      padding: 7px 14px;
      border-radius: 6px;
      font-weight: 500;
      font-size: 0.85rem;
      cursor: pointer;
      transition: background-color 0.15s ease;
    }
    .btn-action:hover {
      background-color: #0369a1;
    }
    .completed-tag {
      font-size: 0.85rem;
      color: #16a34a;
      font-weight: 600;
    }
  `]
})
export class OrderCardComponent {
  // 1. Receives data strictly from parent via Signal input
  readonly order = input.required<Order>();

  // 2. Emits user click UP to parent; never calls OrderService directly
  readonly markDelivered = output<string>();

  // 3. Derived value computed using our pure util function
  readonly totalAmount = computed(() =>
    calculateFinalOrderTotal(this.order().subtotal, this.order().taxRate)
  );

  protected readonly statusVariant = computed<BadgeVariant>(() => {
    switch (this.order().status) {
      case 'DELIVERED':
        return 'success';
      case 'SHIPPED':
        return 'info';
      case 'PENDING':
        return 'warning';
      default:
        return 'neutral';
    }
  });

  onCompleteClick(): void {
    this.markDelivered.emit(this.order().id);
  }
}
