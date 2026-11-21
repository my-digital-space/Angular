import { Injectable, computed, inject } from '@angular/core';
import { UserService } from './user.service';
import { WalletService } from './wallet.service';
import { ToastService } from '../../../core/services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class UserDashboardFacade {
  private readonly userService = inject(UserService);
  private readonly walletService = inject(WalletService);
  private readonly toastService = inject(ToastService);

  readonly userName = this.userService.userName;
  readonly userRole = this.userService.userRole;
  readonly balanceInr = this.walletService.balanceInr;

  // Single consolidated greeting banner signal
  readonly welcomeBanner = computed(
    () => `Hello, ${this.userName()}! (${this.userRole()}) — Wallet Balance: ₹${this.balanceInr().toLocaleString('en-IN')}`
  );

  deposit(amount: number): void {
    this.walletService.deposit(amount);
    this.toastService.success(`Deposited ₹${amount} into wallet. New balance: ₹${this.balanceInr()}`, 'Wallet Deposit');
  }

  withdraw(amount: number): void {
    const success = this.walletService.withdraw(amount);
    if (success) {
      this.toastService.info(`Withdrew ₹${amount} from wallet. New balance: ₹${this.balanceInr()}`, 'Wallet Withdrawal');
    } else {
      this.toastService.error(`Insufficient balance to withdraw ₹${amount}. Current: ₹${this.balanceInr()}`, 'Withdrawal Failed');
    }
  }

  updateProfileName(name: string): void {
    this.userService.setUserName(name);
    this.toastService.info(`User profile name updated to "${name}"`, 'Profile Updated');
  }
}
