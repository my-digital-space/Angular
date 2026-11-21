import { Injectable, signal } from '@angular/core';
import { Order } from './orders.model';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  readonly orders = signal<Order[]>([
    {
      id: 'ORD-901',
      customer: 'Acme Corp',
      item: '4K UltraWide Monitor Arm',
      amount: 249.99,
      status: 'Delivered',
      date: '2026-11-18'
    },
    {
      id: 'ORD-902',
      customer: 'Nexus Labs',
      item: 'Dual Motor Standing Desk Frame',
      amount: 489.00,
      status: 'In Transit',
      date: '2026-11-20'
    },
    {
      id: 'ORD-903',
      customer: 'Cyberdyne Systems',
      item: 'Ergonomic Mesh Chair Pro',
      amount: 329.50,
      status: 'Pending',
      date: '2026-11-21'
    }
  ]);

  addOrder(order: Omit<Order, 'id' | 'date'>): Order {
    const newOrder: Order = {
      ...order,
      id: `ORD-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0]
    };
    this.orders.update(prev => [newOrder, ...prev]);
    return newOrder;
  }

  updateStatus(id: string, newStatus: Order['status']): void {
    this.orders.update(orders =>
      orders.map(order => order.id === id ? { ...order, status: newStatus } : order)
    );
  }
}
