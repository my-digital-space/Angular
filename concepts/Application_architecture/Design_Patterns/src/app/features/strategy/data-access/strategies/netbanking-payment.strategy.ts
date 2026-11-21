import { Injectable } from '@angular/core';
import { PaymentStrategy } from '../payment-strategy.token';

@Injectable()
export class NetBankingPaymentStrategy implements PaymentStrategy {
  readonly type = 'NET_BANKING' as const;
  readonly displayName = 'Net Banking (IMPS / NEFT)';
  readonly icon = '🏦';
  readonly feeDescription = 'Flat ₹15 IMPS Interbank Settlement Fee';

  calculateFee(): number {
    return 15; // Flat ₹15 fee
  }

  executePayment(amount: number): string {
    const total = amount + this.calculateFee();
    return `Net Banking transfer of ₹${total} queued with central clearing (Includes ₹15 IMPS fee)`;
  }
}
