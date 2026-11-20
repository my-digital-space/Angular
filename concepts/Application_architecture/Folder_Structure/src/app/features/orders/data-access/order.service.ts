import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from './order.model';

@Injectable({
  providedIn: 'root' // Tree-shakable singleton service
})
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/v1/orders';

  // Private writable signal protects state from accidental external mutations
  private readonly ordersState = signal<Order[]>([
    { id: 'ORD-101', customerName: 'Ananya Sharma', subtotal: 2500, taxRate: 0.18, status: 'PENDING' },
    { id: 'ORD-102', customerName: 'Rohan Das', subtotal: 4200, taxRate: 0.18, status: 'SHIPPED' },
    { id: 'ORD-103', customerName: 'Priya Patel', subtotal: 6800, taxRate: 0.18, status: 'DELIVERED' }
  ]);

  // Public read-only signal exposed to Smart Components
  readonly orders = this.ordersState.asReadonly();

  // Business action: marks an order as delivered
  markAsDelivered(orderId: string): void {
    // In production API integration, call this.http.patch(...) before updating local state
    this.ordersState.update((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId ? { ...order, status: 'DELIVERED' } : order
      )
    );
  }
}
