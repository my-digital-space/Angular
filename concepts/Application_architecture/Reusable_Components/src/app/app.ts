import { Component, signal } from '@angular/core';
import { OrderSummaryPageComponent } from './features/orders/feature/order-summary-page.component';

@Component({
  imports: [OrderSummaryPageComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Reusable_Components');
}
