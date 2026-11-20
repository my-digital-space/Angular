import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

export type BadgeVariant = 'success' | 'warning' | 'info' | 'neutral' | 'danger';

/**
 * Shared Dumb Presentational Component
 * Purely presentation driven by inputs; has zero external service dependencies.
 */
@Component({
  selector: 'app-status-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="badge" [class]="computedClass()">
      {{ label() }}
    </span>
  `,
  styles: [`
    .badge {
      display: inline-block;
      padding: 3px 10px;
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-radius: 9999px;
    }
    .badge-success { background-color: #dcfce7; color: #15803d; }
    .badge-warning { background-color: #fef9c3; color: #a16207; }
    .badge-info { background-color: #e0f2fe; color: #0369a1; }
    .badge-neutral { background-color: #f1f5f9; color: #475569; }
    .badge-danger { background-color: #fee2e2; color: #b91c1c; }
  `]
})
export class StatusBadgeComponent {
  readonly label = input.required<string>();
  readonly variant = input<BadgeVariant>('neutral');

  protected readonly computedClass = computed(() => `badge-${this.variant()}`);
}
