import { InjectionToken } from '@angular/core';

export type PaymentMethodType = 'UPI' | 'CARD' | 'NET_BANKING' | 'CRYPTO';

/**
 * PaymentStrategy Contract
 * 
 * Every concrete payment strategy must conform to this contract.
 * Algorithms are encapsulated into their own classes, allowing them
 * to be swapped at runtime without modifying the caller (Open/Closed Principle).
 */
export interface PaymentStrategy {
  readonly type: PaymentMethodType;
  readonly displayName: string;
  readonly icon: string;
  readonly feeDescription: string;
  calculateFee(amount: number): number;
  executePayment(amount: number): string;
}

/**
 * Multi-token holding an array of all registered PaymentStrategy implementations.
 * CRITICAL: Providers must declare { multi: true } to prevent Angular from
 * overwriting earlier registrations!
 */
export const PAYMENT_STRATEGIES = new InjectionToken<PaymentStrategy[]>('PAYMENT_STRATEGIES');
