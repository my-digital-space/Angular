import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaymentContextService } from '../data-access/payment-context.service';
import { PaymentMethodType } from '../data-access/payment-strategy.token';
import { ShippingStrategy, StandardShipping, ExpressShipping, DroneDeliveryShipping } from '../data-access/strategies/shipping.strategy';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-strategy-page',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, FormsModule],
  templateUrl: './strategy-page.component.html',
  styleUrl: './strategy-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StrategyPageComponent {
  protected readonly paymentContext = inject(PaymentContextService);
  private readonly toastService = inject(ToastService);

  protected readonly activeTab = signal<'payments' | 'shipping' | 'architecture'>('payments');

  // Payment Demo State
  protected readonly orderAmount = signal(3500);
  protected readonly lastTxnMessage = signal<string | null>(null);

  protected readonly convenienceFee = computed(() =>
    this.paymentContext.activeStrategy().calculateFee(this.orderAmount())
  );

  protected readonly totalAmount = computed(() =>
    this.orderAmount() + this.convenienceFee()
  );

  // Shipping Demo State
  protected readonly shippingWeightKg = signal(4.2);
  protected readonly shippingStrategies: ShippingStrategy[] = [
    new StandardShipping(),
    new ExpressShipping(),
    new DroneDeliveryShipping()
  ];
  protected readonly activeShippingStrategy = signal<ShippingStrategy>(this.shippingStrategies[0]);

  protected readonly shippingCost = computed(() =>
    this.activeShippingStrategy().calculateCost(this.shippingWeightKg())
  );

  decrementAmount(step = 500): void {
    this.orderAmount.update(amt => Math.max(500, amt - step));
  }

  incrementAmount(step = 500): void {
    this.orderAmount.update(amt => amt + step);
  }

  onMethodChange(type: PaymentMethodType): void {
    this.paymentContext.selectMethod(type);
    this.lastTxnMessage.set(null);
  }

  onPay(): void {
    const result = this.paymentContext.process(this.orderAmount());
    this.lastTxnMessage.set(result);
  }

  onShippingSelect(strategy: ShippingStrategy): void {
    this.activeShippingStrategy.set(strategy);
    this.toastService.info(
      `Swapped shipping strategy to "${strategy.label}" (Fee: ₹${this.shippingCost()})`,
      'Shipping Strategy Swapped'
    );
  }
}
