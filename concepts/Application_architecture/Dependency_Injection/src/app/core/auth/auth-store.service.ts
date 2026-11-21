import { Injectable, Signal, signal } from '@angular/core';

/**
 * Abstract contract exposing ONLY read operations (Interface Segregation Principle).
 * Consumers injecting this facade have zero access to write methods like logout() or login().
 */
export abstract class UserSessionReader {
  abstract readonly currentUserName: Signal<string | null>;
}

/**
 * Core AuthStoreService managing authentication state.
 * Implements UserSessionReader and is aliased via `useExisting`.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthStoreService implements UserSessionReader {
  private readonly userSignal = signal<string | null>('Aarav Mehta');

  // Public read-only signal exposed through UserSessionReader contract
  readonly currentUserName = this.userSignal.asReadonly();

  // Sensitive write methods (hidden from components that only inject UserSessionReader)
  login(name: string): void {
    this.userSignal.set(name);
  }

  logout(): void {
    this.userSignal.set(null);
  }
}
