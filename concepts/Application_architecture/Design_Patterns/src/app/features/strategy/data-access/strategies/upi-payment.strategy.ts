import { Injectable } from '@angular/core';
import { PaymentStrategy } from '../payment-strategy.token';

@Injectable()
export class UpiPaymentStrategy implements PaymentStrategy {
  readonly type = 'UPI' as const;
  readonly displayName = 'UPI (Instant QR / VPA)';
  readonly icon = '⚡';
  readonly feeDescription = '₹0 Convenience Fee (Free & Instant)';

  calculateFee(): number {
    return 0; // UPI has zero processing fee
  }

  executePayment(amount: number): string {
    return `Transaction of ₹${amount} completed instantly via UPI VPA (Ref: UPI-${Date.now().toString().slice(-6)})`;
  }
}
