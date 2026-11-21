import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';

@Component({
  selector: 'app-orders-fallback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fallback-card">
      <div class="fallback-badge">Circuit Breaker • Graceful Degradation</div>
      <div class="fallback-icon">⚠️</div>
      <h2>Orders Remote is Temporarily Unavailable</h2>
      <p class="fallback-desc">
        The Host Shell attempted to dynamically load <code>orders-mfe</code> from <code>http://localhost:4201/remoteEntry.json</code>,
        but the connection was refused or the service is offline.
      </p>
      <div class="diagnostic-box">
        <strong>Resilience Edge Case (PDF Page 13):</strong>
        <p>
          Instead of throwing an unhandled chunk error and crashing the entire Angular Host Shell,
          the route's <code>.catch()</code> handler caught the failure and mounted this isolated fallback view.
        </p>
        <code>loadRemoteModule('orders-mfe', './Routes').catch(err => ORDERS_FALLBACK_ROUTES)</code>
      </div>
      <div class="fallback-actions">
        <button class="btn btn-primary" (click)="reloadPage()">
          ↻ Retry Connection (Port 4201)
        </button>
      </div>
    </div>
  `,
  styles: [`
    .fallback-card {
      border: 2px dashed #f59e0b;
      background: #1c1404;
      border-radius: 12px;
      padding: 2.5rem;
      text-align: center;
      max-width: 680px;
      margin: 2rem auto;
      box-shadow: 0 10px 30px rgba(245, 158, 11, 0.15);
    }
    .fallback-badge {
      display: inline-block;
      background: rgba(245, 158, 11, 0.2);
      color: #fbbf24;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
      margin-bottom: 1rem;
      border: 1px solid rgba(245, 158, 11, 0.35);
    }
    .fallback-icon { font-size: 3rem; margin-bottom: 0.5rem; }
    h2 { color: #fef3c7; margin: 0 0 0.75rem 0; font-size: 1.5rem; }
    .fallback-desc { color: #d97706; font-size: 0.95rem; line-height: 1.5; margin: 0 0 1.5rem 0; }
    .diagnostic-box {
      background: #0d0901;
      border: 1px solid #451a03;
      border-radius: 8px;
      padding: 1rem;
      text-align: left;
      margin-bottom: 1.5rem;
      color: #fbbf24;
      font-size: 0.85rem;
    }
    .diagnostic-box p { margin: 0.35rem 0 0.75rem 0; color: #fde68a; }
    .diagnostic-box code { display: block; background: #000; padding: 0.5rem; border-radius: 4px; color: #38bdf8; font-size: 0.8rem; }
    .btn {
      padding: 0.6rem 1.25rem;
      background: #f59e0b;
      color: #000;
      font-weight: 700;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }
    .btn:hover { background: #d97706; }
  `]
})
export class OrdersFallbackComponent {
  reloadPage(): void {
    window.location.reload();
  }
}

export const ORDERS_FALLBACK_ROUTES: Routes = [
  { path: '', component: OrdersFallbackComponent }
];
