import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { InfoCardComponent } from '../../../shared/ui/info-card/info-card.component';
import { ActionButtonComponent } from '../../../shared/ui/action-button/action-button.component';

@Component({
  selector: 'app-order-summary-page',
  imports: [InfoCardComponent, ActionButtonComponent],
  templateUrl: './order-summary-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderSummaryPageComponent {
  readonly isVisible = signal(true);

  cancelOrder(): void {
    console.log('Order cancelled');
  }

  approveOrder(): void {
    console.log('Order approved');
  }
}
