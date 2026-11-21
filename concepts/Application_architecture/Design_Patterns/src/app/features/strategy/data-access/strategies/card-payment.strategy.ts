import { Injectable } from '@angular/core';
import { PaymentStrategy } from '../payment-strategy.token';

@Injectable()
export class CardPaymentStrategy implements PaymentStrategy {
  readonly type = 'CARD' as const;
  readonly displayName = 'Credit / Debit Card';
  readonly icon = '💳';
  readonly feeDescription = '2% Gateway Processing Charge';

  calculateFee(amount: number): number {
    return Math.round(amount * 0.02); // 2% gateway charge
  }

  executePayment(amount: number): string {
    const fee = this.calculateFee(amount);
    const total = amount + fee;
    return `Transaction of ₹${total} authorized via Visa/Mastercard (Base: ₹${amount} + 2% Fee: ₹${fee})`;
  }
}
