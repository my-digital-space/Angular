import { Injectable, computed, inject } from '@angular/core';
import { CartItemsService, CartItem } from './cart-items.service';
import { LoyaltyDiscountService, LoyaltyTier } from './loyalty-discount.service';
import { ToastService } from '../../../core/services/toast.service';

/**
 * CheckoutFacade
 * 
 * Sits cleanly between the UI component and the subsystem services:
 * - CartItemsService (manages inventory & items)
 * - LoyaltyDiscountService (computes user tier & discount percentages)
 * 
 * The UI component injects ONLY CheckoutFacade, keeping it thin,
 * clean, and decoupled from underlying stores.
 */
@Injectable({
  providedIn: 'root'
})
export class CheckoutFacade {
  // Underlying services injected privately
  private readonly cartService = inject(CartItemsService);
  private readonly loyaltyService = inject(LoyaltyDiscountService);
  private readonly toastService = inject(ToastService);

  // Expose clean, ready-to-render state to the UI via Signals
  readonly items = this.cartService.items;
  readonly currentTier = this.loyaltyService.currentTier;
  readonly discountRate = this.loyaltyService.discountRate;

  // Real-time computed derivations
  readonly itemCount = computed(() =>
    this.items().reduce((count, item) => count + item.quantity, 0)
  );

  readonly subtotal = computed(() =>
    this.items().reduce((sum, item) => sum + (item.price * item.quantity), 0)
  );

  readonly discountAmount = computed(() =>
    Math.round(this.subtotal() * this.discountRate())
  );

  readonly finalPayable = computed(() =>
    Math.max(0, this.subtotal() - this.discountAmount())
  );

  // Facade public actions
  addItem(name: string, price: number): void {
    this.cartService.addItem(name, price);
    this.toastService.info(`Added "${name}" (₹${price}) to cart.`, 'Cart Updated');
  }

  removeItem(id: number): void {
    const item = this.items().find(i => i.id === id);
    this.cartService.removeItem(id);
    this.toastService.warning(`Removed "${item?.name || 'Item'}" from cart.`, 'Item Removed');
  }

  incrementQuantity(id: number): void {
    this.cartService.incrementQuantity(id);
  }

  decrementQuantity(id: number): void {
    this.cartService.decrementQuantity(id);
  }

  changeTier(tier: LoyaltyTier): void {
    this.loyaltyService.setTier(tier);
    this.toastService.info(
      `Loyalty membership changed to ${tier.toUpperCase()} (${(this.discountRate() * 100)}% off).`,
      'Discount Applied'
    );
  }

  processCheckout(): boolean {
    if (this.items().length === 0) {
      this.toastService.error('Cannot checkout with an empty cart!', 'Checkout Failed');
      return false;
    }

    const payable = this.finalPayable();
    const discount = this.discountAmount();
    this.toastService.success(
      `Order placed successfully! Total Paid: ₹${payable} (You saved ₹${discount})`,
      'Order Confirmed'
    );
    return true;
  }
}
