import { Injectable, computed, inject, signal } from '@angular/core';
import { PAYMENT_STRATEGIES, PaymentMethodType, PaymentStrategy } from './payment-strategy.token';
import { ToastService } from '../../../core/services/toast.service';

/**
 * PaymentContextService
 * 
 * Injects all registered payment strategies via the multi-token PAYMENT_STRATEGIES.
 * Translates the array into a Map for O(1) dynamic strategy selection.
 * Exposes an activeStrategy signal that automatically resolves without any if/else chains.
 */
@Injectable()
export class PaymentContextService {
  private readonly strategies = inject(PAYMENT_STRATEGIES);
  private readonly toastService = inject(ToastService);

  // Map for O(1) strategy retrieval by key
  private readonly strategyMap = new Map<PaymentMethodType, PaymentStrategy>(
    this.strategies.map(strategy => [strategy.type, strategy])
  );

  // Expose registered options to render UI dynamically
  readonly availableMethods = this.strategies;

  // Selected payment method signal
  readonly selectedMethod = signal<PaymentMethodType>('UPI');

  // Automatically resolves active strategy when selectedMethod changes
  readonly activeStrategy = computed<PaymentStrategy>(() => {
    const strategy = this.strategyMap.get(this.selectedMethod());
    if (!strategy) {
      throw new Error(`No payment strategy registered for type: ${this.selectedMethod()}`);
    }
    return strategy;
  });

  selectMethod(method: PaymentMethodType): void {
    this.selectedMethod.set(method);
    const active = this.activeStrategy();
    this.toastService.info(
      `Switched payment strategy to ${active.displayName} (${active.feeDescription})`,
      'Strategy Swapped'
    );
  }

  process(baseAmount: number): string {
    // Delegates directly to the active strategy class — ZERO if/else statements!
    const result = this.activeStrategy().executePayment(baseAmount);
    this.toastService.success(result, 'Payment Executed');
    return result;
  }
}
