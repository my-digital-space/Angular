import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';

@Component({
  selector: 'app-billing-fallback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fallback-card">
      <div class="fallback-badge">Circuit Breaker • Graceful Degradation</div>
      <div class="fallback-icon">⚠️</div>
      <h2>Billing Remote is Temporarily Unavailable</h2>
      <p class="fallback-desc">
        The Host Shell could not reach <code>billing-mfe</code> on <code>http://localhost:4202/remoteEntry.json</code>.
      </p>
      <div class="diagnostic-box">
        <strong>Resilience Edge Case (PDF Page 13):</strong>
        <p>
          "What if a Remote server goes down? If billing-mfe is offline when the user clicks /billing,
          loadRemoteModule() will reject and crash navigation unless handled. Always add a .catch() fallback
          component so one broken micro-app never crashes the whole Shell."
        </p>
        <code>loadRemoteModule('billing-mfe', './Routes').catch(err => BILLING_FALLBACK_ROUTES)</code>
      </div>
      <div class="fallback-actions">
        <button class="btn btn-primary" (click)="reloadPage()">
          ↻ Retry Connection (Port 4202)
        </button>
      </div>
    </div>
  `,
  styles: [`
    .fallback-card {
      border: 2px dashed #f43f5e;
      background: #1f080c;
      border-radius: 12px;
      padding: 2.5rem;
      text-align: center;
      max-width: 680px;
      margin: 2rem auto;
      box-shadow: 0 10px 30px rgba(244, 63, 94, 0.15);
    }
    .fallback-badge {
      display: inline-block;
      background: rgba(244, 63, 94, 0.2);
      color: #fda4af;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
      margin-bottom: 1rem;
      border: 1px solid rgba(244, 63, 94, 0.35);
    }
    .fallback-icon { font-size: 3rem; margin-bottom: 0.5rem; }
    h2 { color: #ffe4e6; margin: 0 0 0.75rem 0; font-size: 1.5rem; }
    .fallback-desc { color: #fb7185; font-size: 0.95rem; line-height: 1.5; margin: 0 0 1.5rem 0; }
    .diagnostic-box {
      background: #0d0204;
      border: 1px solid #4c0519;
      border-radius: 8px;
      padding: 1rem;
      text-align: left;
      margin-bottom: 1.5rem;
      color: #fda4af;
      font-size: 0.85rem;
    }
    .diagnostic-box p { margin: 0.35rem 0 0.75rem 0; color: #fecdd3; }
    .diagnostic-box code { display: block; background: #000; padding: 0.5rem; border-radius: 4px; color: #38bdf8; font-size: 0.8rem; }
    .btn {
      padding: 0.6rem 1.25rem;
      background: #f43f5e;
      color: #fff;
      font-weight: 700;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }
    .btn:hover { background: #e11d48; }
  `]
})
export class BillingFallbackComponent {
  reloadPage(): void {
    window.location.reload();
  }
}

export const BILLING_FALLBACK_ROUTES: Routes = [
  { path: '', component: BillingFallbackComponent }
];
