import { Injectable, signal } from '@angular/core';

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

/**
 * App-wide Singleton Auth Service
 * Provided in root; manages authentication state across the application.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly userState = signal<CurrentUser | null>({
    id: 'USR-101',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    role: 'admin'
  });

  // Read-only signal exposure protects internal state
  readonly currentUser = this.userState.asReadonly();

  logout(): void {
    this.userState.set(null);
  }
}
