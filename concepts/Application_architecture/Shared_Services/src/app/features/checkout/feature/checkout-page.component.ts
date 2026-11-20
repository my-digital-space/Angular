import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CartStoreService } from '../../../shared/data-access/cart/cart-store.service';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckoutPageComponent {
  protected readonly cartStore = inject(CartStoreService);
  protected readonly couponInput = signal('');

  onApplyCoupon(): void {
    this.cartStore.applyCoupon(this.couponInput());
  }
}
