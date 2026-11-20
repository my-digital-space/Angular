import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CartStoreService } from '../../shared/data-access/cart/cart-store.service';

interface CatalogProduct {
  productId: string;
  name: string;
  description: string;
  unitPrice: number;
  category: string;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  protected readonly cartStore = inject(CartStoreService);

  readonly products: CatalogProduct[] = [
    {
      productId: 'PRD-01',
      name: 'Ergonomic Split Keyboard',
      description: 'Custom mechanical switches with Alice layout and wrist support',
      unitPrice: 8500,
      category: 'Peripherals'
    },
    {
      productId: 'PRD-02',
      name: 'Wireless Vertical Mouse',
      description: 'Ergonomic 57-degree angle with silent acoustic clicks',
      unitPrice: 3200,
      category: 'Peripherals'
    },
    {
      productId: 'PRD-03',
      name: '27-inch 4K IPS Monitor',
      description: 'Factory-calibrated 99% sRGB with 90W USB-C Power Delivery',
      unitPrice: 28990,
      category: 'Displays'
    },
    {
      productId: 'PRD-04',
      name: 'Active Noise Cancelling Headphones',
      description: 'Multi-point Bluetooth 5.4 with transparency mode & 40h battery',
      unitPrice: 14499,
      category: 'Audio'
    },
    {
      productId: 'PRD-05',
      name: 'Thunderbolt 4 Docking Station',
      description: 'Dual 4K@60Hz display support, 2.5G Ethernet, 100W PD passthrough',
      unitPrice: 11999,
      category: 'Accessories'
    }
  ];

  onAddToCart(product: CatalogProduct): void {
    this.cartStore.addItem({
      productId: product.productId,
      name: product.name,
      unitPrice: product.unitPrice
    });
  }
}
