import { Injectable, computed, signal } from '@angular/core';

export type LoyaltyTier = 'standard' | 'silver' | 'gold' | 'platinum';

@Injectable({
  providedIn: 'root'
})
export class LoyaltyDiscountService {
  readonly currentTier = signal<LoyaltyTier>('silver');

  readonly discountRate = computed(() => {
    switch (this.currentTier()) {
      case 'platinum': return 0.25; // 25% discount
      case 'gold': return 0.15;     // 15% discount
      case 'silver': return 0.10;   // 10% discount
      case 'standard': default: return 0.0;
    }
  });

  setTier(tier: LoyaltyTier): void {
    this.currentTier.set(tier);
  }
}
