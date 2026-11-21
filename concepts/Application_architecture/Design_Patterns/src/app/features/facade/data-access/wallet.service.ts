import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  readonly balanceInr = signal(1250);

  deposit(amount: number): void {
    if (amount > 0) {
      this.balanceInr.update(b => b + amount);
    }
  }

  withdraw(amount: number): boolean {
    if (amount > 0 && this.balanceInr() >= amount) {
      this.balanceInr.update(b => b - amount);
      return true;
    }
    return false;
  }
}
