import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CustomerService } from '../data-access/customer.service';
import { CustomerCardComponent } from '../ui/customer-card.component';

/**
 * Smart Container Component (Page)
 */
@Component({
  selector: 'app-customer-list-page',
  standalone: true,
  imports: [CustomerCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="customers-page">
      <header class="page-header">
        <h2>Customer Directory</h2>
        <p class="description">
          Demonstrating multi-feature scalability under the 4-layer architecture.
        </p>
      </header>

      <div class="customers-list">
        @for (item of customerService.customers(); track item.id) {
          <app-customer-card [customer]="item" />
        }
      </div>
    </section>
  `,
  styles: [`
    .customers-page {
      max-width: 720px;
      margin: 0 auto;
    }
    .page-header {
      margin-bottom: 20px;
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
    .customers-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
  `]
})
export class CustomerListPageComponent {
  protected readonly customerService = inject(CustomerService);
}
