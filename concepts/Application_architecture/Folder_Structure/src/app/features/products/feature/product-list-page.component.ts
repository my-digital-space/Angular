import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ProductService } from '../data-access/product.service';
import { Product } from '../data-access/product.model';
import { ProductCardComponent } from '../ui/product-card.component';
import { CartStoreService, DomainEventBusService } from '@app/core';

/**
 * Smart Container Component (Products Page)
 *
 * Demonstrates Cross-Feature Communication Pattern 2 & 3:
 * 1. Coordinates internal feature state (ProductService).
 * 2. Communicates with Cart domain via shared Core Cart Store (CartStoreService).
 * 3. Dispatches decoupled domain events via DomainEventBusService.
 */
@Component({
  selector: 'app-product-list-page',
  imports: [ProductCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="products-page">
      <header class="page-header">
        <h2>Enterprise Product Catalog</h2>
        <p class="description">
          Browsing products in <code>features/products/</code>. Adding an item communicates across domains to <code>core/state/cart-store</code>.
        </p>
      </header>

      <div class="products-grid">
        @for (item of productService.products(); track item.id) {
          <app-product-card
            [product]="item"
            (addToCart)="handleAddToCart($event)"
          />
        }
      </div>
    </section>
  `,
  styles: [`
    .products-page {
      max-width: 900px;
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
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 16px;
    }
  `]
})
export class ProductListPageComponent {
  protected readonly productService = inject(ProductService);
  private readonly cartStore = inject(CartStoreService);
  private readonly eventBus = inject(DomainEventBusService);

  handleAddToCart(product: Product): void {
    // Cross-Feature Data Flow: Mutate shared state
    this.cartStore.addToCart({
      id: product.id,
      name: product.name,
      price: product.price
    });

    // Cross-Feature Pub-Sub: Notify event listeners
    this.eventBus.dispatch('PRODUCT_ADDED_TO_CART', {
      productId: product.id,
      productName: product.name
    });
  }
}
