import { Component, ChangeDetectionStrategy, inject, signal, effect, OnDestroy } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { FontSizeService } from '../data-access/font-size.service';
import { EventBusService, AppTelemetryEvent } from '../data-access/event-bus.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-observer-page',
  standalone: true,
  imports: [DecimalPipe, RouterLink],
  templateUrl: './observer-page.component.html',
  styleUrl: './observer-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObserverPageComponent implements OnDestroy {
  protected readonly fontService = inject(FontSizeService);
  protected readonly eventBus = inject(EventBusService);
  private readonly toastService = inject(ToastService);

  protected readonly activeTab = signal<'fontSize' | 'eventBus' | 'architecture'>('fontSize');

  // Multi-observer telemetry counters
  protected readonly auditSubscriberLogs = signal<string[]>([]);
  protected readonly analyticsSubscriberLogs = signal<string[]>([]);

  private rxSubscription?: Subscription;

  constructor() {
    // Observer A: Component level effect tracking font size changes
    effect(() => {
      const size = this.fontService.fontSizePx();
      // Track size change
    });

    // Observer B: RxJS subscriber mimicking an external audit service
    this.rxSubscription = this.eventBus.events$.subscribe(event => {
      this.auditSubscriberLogs.update(logs => [
        `[AUDIT SECURE] ${event.type} from ${event.source}: ${event.payload}`,
        ...logs.slice(0, 5)
      ]);
      this.analyticsSubscriberLogs.update(logs => [
        `[ANALYTICS] Event ID ${event.id} recorded at ${event.timestamp.toLocaleTimeString()}`,
        ...logs.slice(0, 5)
      ]);
    });
  }

  ngOnDestroy(): void {
    this.rxSubscription?.unsubscribe();
  }

  onIncreaseFont(): void {
    this.fontService.increase();
    this.toastService.info(`Font size updated to ${this.fontService.fontSizePx()}px via Signal Subject.`, 'Observer Notified');
  }

  onDecreaseFont(): void {
    this.fontService.decrease();
    this.toastService.info(`Font size updated to ${this.fontService.fontSizePx()}px via Signal Subject.`, 'Observer Notified');
  }

  onResetFont(): void {
    this.fontService.reset();
    this.toastService.info('Font size reset to default (16px).', 'Observer Notified');
  }

  triggerSimulatedEvent(source: string, type: AppTelemetryEvent['type'], payload: string): void {
    this.eventBus.broadcast(source, type, payload);
    this.toastService.success(
      `Broadcasted ${type} event to multiple decoupled observers simultaneously!`,
      'Subject Broadcast'
    );
  }
}
