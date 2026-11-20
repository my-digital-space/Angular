import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CartStoreService } from '../state/cart-store.service';

/**
 * Core Application Header Shell Component
 * Consumes CartStoreService to display real-time reactive cart count badge.
 */
@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="app-header">
      <div class="brand">
        <span class="brand-badge">PROD</span>
        <strong class="brand-title">Enterprise Angular 22</strong>
      </div>

      <nav class="nav-links">
        <a routerLink="/products" routerLinkActive="active">Products</a>
        <a routerLink="/cart" routerLinkActive="active" class="cart-nav-link">
          Cart
          @if (cartStore.totalItemCount() > 0) {
            <span class="cart-pill">{{ cartStore.totalItemCount() }}</span>
          }
        </a>
        <a routerLink="/orders" routerLinkActive="active">Orders</a>
        <a routerLink="/customers" routerLinkActive="active">Customers</a>
      </nav>

      <div class="user-info">
        @if (authService.currentUser(); as user) {
          <span class="user-pill">{{ user.name }} ({{ user.role }})</span>
        }
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 24px;
      background: #0f172a;
      color: #f8fafc;
      border-bottom: 1px solid #1e293b;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .brand-badge {
      background: #0284c7;
      color: white;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 3px 7px;
      border-radius: 4px;
      letter-spacing: 0.05em;
    }
    .brand-title {
      font-size: 1.05rem;
      letter-spacing: -0.01em;
    }
    .nav-links {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .nav-links a {
      color: #94a3b8;
      text-decoration: none;
      font-weight: 500;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 0.9rem;
      transition: all 0.15s ease;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .nav-links a.active, .nav-links a:hover {
      color: #38bdf8;
      background: #1e293b;
    }
    .cart-pill {
      background: #0284c7;
      color: white;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 9999px;
    }
    .user-info {
      font-size: 0.85rem;
    }
    .user-pill {
      background: #1e293b;
      padding: 5px 12px;
      border-radius: 9999px;
      color: #cbd5e1;
    }
  `]
})
export class HeaderComponent {
  protected readonly authService = inject(AuthService);
  protected readonly cartStore = inject(CartStoreService);
}
