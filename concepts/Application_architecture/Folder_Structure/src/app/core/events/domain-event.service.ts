import { Injectable, signal } from '@angular/core';

export type DomainEventType =
  | 'PRODUCT_VIEWED'
  | 'PRODUCT_ADDED_TO_CART'
  | 'ORDER_PLACED'
  | 'CUSTOMER_SELECTED';

export interface DomainEvent<T = unknown> {
  type: DomainEventType;
  payload: T;
  timestamp: number;
}

/**
 * Enterprise Decoupled Domain Event Bus
 *
 * Professional Architecture Principle:
 * Enables 100% loose coupling between features.
 * Feature A dispatches an event without knowing who handles it.
 * Feature B (Analytics, Notifications, Audit) subscribes without importing Feature A.
 */
@Injectable({
  providedIn: 'root'
})
export class DomainEventBusService {
  private readonly latestEventState = signal<DomainEvent | null>(null);

  readonly latestEvent = this.latestEventState.asReadonly();

  dispatch<T>(type: DomainEventType, payload: T): void {
    this.latestEventState.set({
      type,
      payload,
      timestamp: Date.now()
    });
  }
}
