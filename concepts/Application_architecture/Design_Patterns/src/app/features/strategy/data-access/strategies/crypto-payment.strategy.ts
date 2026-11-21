import { Injectable } from '@angular/core';
import { PaymentStrategy } from '../payment-strategy.token';

@Injectable()
export class CryptoPaymentStrategy implements PaymentStrategy {
  readonly type = 'CRYPTO' as const;
  readonly displayName = 'Web3 Wallet (USDC / ETH)';
  readonly icon = '🪙';
  readonly feeDescription = '1% Blockchain Network Gas Estimate';

  calculateFee(amount: number): number {
    return Math.max(10, Math.round(amount * 0.01)); // 1% or min 10
  }

  executePayment(amount: number): string {
    const fee = this.calculateFee(amount);
    const total = amount + fee;
    return `Smart contract transaction of ₹${total} broadcasted to EVM chain (Gas: ₹${fee})`;
  }
}
