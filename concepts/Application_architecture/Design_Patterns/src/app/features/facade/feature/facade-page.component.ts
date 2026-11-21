import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CheckoutFacade } from '../data-access/checkout.facade';
import { UserDashboardFacade } from '../data-access/user-dashboard.facade';
import { LoyaltyTier } from '../data-access/loyalty-discount.service';

@Component({
  selector: 'app-facade-page',
  standalone: true,
  imports: [CurrencyPipe, UpperCasePipe, RouterLink, FormsModule],
  templateUrl: './facade-page.component.html',
  styleUrl: './facade-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacadePageComponent {
  // Only inject the facades — zero knowledge of internal Cart, Loyalty, User, or Wallet services
  protected readonly checkout = inject(CheckoutFacade);
  protected readonly dashboard = inject(UserDashboardFacade);

  protected readonly activeTab = signal<'checkout' | 'dashboard' | 'architecture'>('checkout');

  // Input states for interactive additions
  protected newItemName = signal('USB-C 100W Cable');
  protected newItemPrice = signal(999);
  protected customUserName = signal('');

  onAddCustomItem(): void {
    const name = this.newItemName().trim();
    const price = Number(this.newItemPrice());
    if (name && price > 0) {
      this.checkout.addItem(name, price);
    }
  }

  onTierChange(event: Event): void {
    const tier = (event.target as HTMLSelectElement).value as LoyaltyTier;
    this.checkout.changeTier(tier);
  }

  onUpdateUserName(): void {
    if (this.customUserName().trim()) {
      this.dashboard.updateProfileName(this.customUserName().trim());
      this.customUserName.set('');
    }
  }
}
