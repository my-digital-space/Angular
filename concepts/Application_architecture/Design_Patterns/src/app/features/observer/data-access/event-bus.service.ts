import { Injectable, signal } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface AppTelemetryEvent {
  id: string;
  source: string;
  type: 'PAYMENT' | 'SECURITY' | 'INVENTORY' | 'NOTIFICATION';
  payload: string;
  timestamp: Date;
}

/**
 * EventBusService demonstrates the Observer Pattern using both
 * RxJS Subject (push-based asynchronous events) and Angular Signals.
 */
@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  // RxJS Subject (Event Stream Subject)
  private readonly _eventStream$ = new Subject<AppTelemetryEvent>();
  readonly events$: Observable<AppTelemetryEvent> = this._eventStream$.asObservable();

  // Signal state of last event
  readonly lastDispatchedEvent = signal<AppTelemetryEvent | null>(null);

  // Signal collection of recent events
  readonly recentEvents = signal<AppTelemetryEvent[]>([]);

  broadcast(source: string, type: AppTelemetryEvent['type'], payload: string): void {
    const event: AppTelemetryEvent = {
      id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      source,
      type,
      payload,
      timestamp: new Date()
    };

    // Notify all RxJS subscribers
    this._eventStream$.next(event);

    // Notify all Signal template observers
    this.lastDispatchedEvent.set(event);
    this.recentEvents.update(list => [event, ...list.slice(0, 9)]);
  }

  clear(): void {
    this.recentEvents.set([]);
    this.lastDispatchedEvent.set(null);
  }
}
