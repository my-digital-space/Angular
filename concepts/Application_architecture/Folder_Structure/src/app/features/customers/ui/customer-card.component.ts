import { Component, ChangeDetectionStrategy, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Customer } from '../data-access/customer.model';
import { formatCustomerInitials } from '../util/customer-format.util';
import { StatusBadgeComponent, BadgeVariant } from '@app/shared';

/**
 * Dumb Presentational Component
 * Demonstrates cross-feature navigation via routerLink query params:
 * Navigates to `/orders?customerName=...` without importing the Orders feature!
 */
@Component({
  selector: 'app-customer-card',
  imports: [StatusBadgeComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="customer-card">
      <div class="avatar">{{ initials() }}</div>
      <div class="customer-details">
        <div class="top-row">
          <h4 class="name">{{ customer().name }}</h4>
          <app-status-badge [label]="customer().tier" [variant]="tierVariant()" />
        </div>
        <p class="company">{{ customer().company }}</p>
        <p class="email">{{ customer().email }}</p>
      </div>

      <div class="actions">
        <!-- Cross-feature navigation via URL query params -->
        <a
          class="btn-view-orders"
          [routerLink]="['/orders']"
          [queryParams]="{ customerName: customer().name }"
        >
          View Orders →
        </a>
      </div>
    </div>
  `,
  styles: [`
    .customer-card {
      display: flex;
      align-items: center;
      gap: 16px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 16px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
    .avatar {
      width: 46px;
      height: 46px;
      border-radius: 50%;
      background: #0284c7;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1rem;
      flex-shrink: 0;
    }
    .customer-details {
      flex: 1;
    }
    .top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .name {
      margin: 0;
      color: #0f172a;
      font-size: 1.05rem;
    }
    .company {
      margin: 4px 0 0 0;
      color: #475569;
      font-size: 0.9rem;
      font-weight: 500;
    }
    .email {
      margin: 2px 0 0 0;
      color: #94a3b8;
      font-size: 0.82rem;
    }
    .actions {
      display: flex;
      align-items: center;
    }
    .btn-view-orders {
      text-decoration: none;
      font-size: 0.8rem;
      font-weight: 600;
      color: #0284c7;
      padding: 6px 12px;
      border: 1px solid #bae6fd;
      background: #f0f9ff;
      border-radius: 6px;
      transition: all 0.15s ease;
      white-space: nowrap;
    }
    .btn-view-orders:hover {
      background: #0284c7;
      color: white;
    }
  `]
})
export class CustomerCardComponent {
  readonly customer = input.required<Customer>();

  protected readonly initials = computed(() => formatCustomerInitials(this.customer().name));

  protected readonly tierVariant = computed<BadgeVariant>(() => {
    switch (this.customer().tier) {
      case 'Enterprise': return 'success';
      case 'Premium': return 'info';
      default: return 'neutral';
    }
  });
}
