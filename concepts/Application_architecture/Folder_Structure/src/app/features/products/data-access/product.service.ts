import { Injectable, signal } from '@angular/core';
import { Product } from './product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly productsState = signal<Product[]>([
    {
      id: 'PROD-101',
      name: 'Cloud Enterprise License',
      category: 'Software',
      price: 1200,
      discountRate: 0.1,
      inStock: true
    },
    {
      id: 'PROD-102',
      name: 'Edge AI Gateway Server',
      category: 'Hardware',
      price: 4500,
      discountRate: 0.15,
      inStock: true
    },
    {
      id: 'PROD-103',
      name: '24/7 Priority Support SLA',
      category: 'Services',
      price: 800,
      discountRate: 0,
      inStock: true
    }
  ]);

  readonly products = this.productsState.asReadonly();
}
