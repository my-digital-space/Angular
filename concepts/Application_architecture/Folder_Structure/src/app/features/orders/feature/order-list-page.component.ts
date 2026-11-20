import { Component, ChangeDetectionStrategy, inject, input, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderService } from '../data-access/order.service';
import { OrderCardComponent } from '../ui/order-card.component';

/**
 * Smart Container Component (Page)
 *
 * Demonstrates Cross-Feature Communication Pattern 1:
 * Receives `customerName` directly from URL query parameters via Angular 22's
 * `withComponentInputBinding()` and reactive `input<string>()`.
 */
@Component({
  selector: 'app-order-list-page',
  imports: [OrderCardComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="orders-page">
      <header class="page-header">
        <div>
          <h2>Customer Orders</h2>
          <p class="description">
            Layered Feature Architecture: Smart container coordinating state & presentational child components.
          </p>
        </div>

        @if (customerName()) {
          <div class="active-filter-banner">
            <span>Filtered by customer: <strong>{{ customerName() }}</strong></span>
            <a class="btn-clear-filter" routerLink="/orders">✕ Clear Filter</a>
          </div>
        }
      </header>

      <!-- Smart component passes state down and listens to dumb component events -->
      <div class="orders-list">
        @for (item of filteredOrders(); track item.id) {
          <app-order-card
            [order]="item"
            (markDelivered)="handleMarkDelivered($event)"
          />
        } @empty {
          <div class="empty-state">
            <p>No orders found for "{{ customerName() }}".</p>
            <a class="btn-reset" routerLink="/orders">Show All Orders</a>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .orders-page {
      max-width: 720px;
      margin: 0 auto;
    }
    .page-header {
      margin-bottom: 20px;
    }
    .page-header h2 {
      margin: 0 0 4px 0;
      color: #0f172a;
      font-size: 1.5rem;
    }
    .description {
      margin: 0;
      color: #64748b;
      font-size: 0.9rem;
    }
    .active-filter-banner {
      margin-top: 12px;
      padding: 8px 14px;
      background: #e0f2fe;
      border: 1px solid #bae6fd;
      border-radius: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.88rem;
      color: #0369a1;
    }
    .btn-clear-filter {
      text-decoration: none;
      color: #0284c7;
      font-weight: 600;
      font-size: 0.8rem;
    }
    .btn-clear-filter:hover {
      text-decoration: underline;
    }
    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .empty-state {
      background: white;
      border: 1px dashed #cbd5e1;
      border-radius: 8px;
      padding: 32px;
      text-align: center;
      color: #94a3b8;
    }
    .btn-reset {
      display: inline-block;
      margin-top: 8px;
      text-decoration: none;
      color: #0284c7;
      font-weight: 600;
      font-size: 0.85rem;
    }
  `]
})
export class OrderListPageComponent {
  // Receives URL query parameter `?customerName=...` via withComponentInputBinding()
  readonly customerName = input<string>();

  // Smart component is authorized to inject data-access services
  protected readonly orderService = inject(OrderService);

  // Dynamically filters orders based on cross-feature route param
  protected readonly filteredOrders = computed(() => {
    const filter = this.customerName();
    const orders = this.orderService.orders();
    if (!filter) return orders;
    return orders.filter((o) =>
      o.customerName.toLowerCase().includes(filter.toLowerCase())
    );
  });

  handleMarkDelivered(orderId: string): void {
    this.orderService.markAsDelivered(orderId);
  }
}
