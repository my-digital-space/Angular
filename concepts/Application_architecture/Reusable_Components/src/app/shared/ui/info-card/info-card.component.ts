import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrl: './info-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfoCardComponent {
  // Card title shown in the header
  readonly title = input.required<string>();

  // Optional subtitle for extra context
  readonly subtitle = input<string>('');

  // Optional flag to show a close/dismiss icon in the top-right corner
  readonly dismissible = input<boolean>(false);

  // Notifies parent if user clicks the dismiss button
  readonly dismissed = output<void>();

  onDismiss(): void {
    this.dismissed.emit();
  }
}
