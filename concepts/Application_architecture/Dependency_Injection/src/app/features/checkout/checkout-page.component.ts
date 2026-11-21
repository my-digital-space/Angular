import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { APP_CONFIG, PaymentGateway } from '../../core/config/app-tokens';
import { UserSessionReader } from '../../core/auth/auth-store.service';

@Component({
  selector: 'app-checkout-page',
  imports: [],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutPageComponent {
  // Component depends on abstract contracts, never concrete implementations
  protected readonly userReader = inject(UserSessionReader);
  private readonly gateway = inject(PaymentGateway);
  protected readonly config = inject(APP_CONFIG);

  protected readonly receiptId = signal<string | null>(null);
  protected readonly isProcessing = signal<boolean>(false);
  protected readonly paymentError = signal<string | null>(null);

  async payNow(): Promise<void> {
    this.isProcessing.set(true);
    this.paymentError.set(null);
    try {
      const txnId = await this.gateway.processPayment(1499);
      this.receiptId.set(txnId);
    } catch {
      this.paymentError.set('Payment could not be completed. Please try again.');
    } finally {
      this.isProcessing.set(false);
    }
  }

  resetReceipt(): void {
    this.receiptId.set(null);
    this.paymentError.set(null);
  }
}
