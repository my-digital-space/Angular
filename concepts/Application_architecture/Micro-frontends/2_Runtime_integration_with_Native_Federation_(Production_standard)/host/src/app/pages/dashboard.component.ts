import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dashboard-container">
      <!-- Hero Header -->
      <section class="hero-card">
        <div class="badge-pill">Pattern 2 • Production Standard</div>
        <h1>Runtime Integration with Native Federation</h1>
        <p class="hero-desc">
          Each micro-app builds and deploys to its own independent URL. The Host Shell (Port 4200) reads
          <code>federation.manifest.json</code> and dynamically downloads remote JavaScript bundles at runtime.
          Angular core packages are shared as browser singletons so Angular is <strong>never downloaded twice</strong>.
        </p>

        <div class="server-topology-bar">
          <div class="server-pill active">
            <span class="status-dot green"></span>
            <span>Host Shell (Port 4200)</span>
          </div>
          <div class="server-arrow">── manifest ──▶</div>
          <div class="server-pill remote-1">
            <span class="status-dot blue"></span>
            <span>Orders MFE (Port 4201)</span>
          </div>
          <div class="server-arrow">── manifest ──▶</div>
          <div class="server-pill remote-2">
            <span class="status-dot purple"></span>
            <span>Billing MFE (Port 4202)</span>
          </div>
        </div>
      </section>

      <!-- Architecture Topology Diagram -->
      <section class="diagram-section">
        <h3 class="section-title">Runtime Federation Architecture Flow</h3>
        <div class="code-diagram">
<pre>
                               Browser (http://localhost:4200)
                                            │
                                            ▼
                        ┌──────────────────────────────────────┐
                        │       HOST SHELL (Port 4200)         │
                        │ • Top Navigation & Shared Auth State │
                        │ • Reads federation.manifest.json     │
                        └───────┬──────────────────────┬───────┘
                                │                      │
                 User navigates │       User navigates │
                    to /orders  │          to /billing │
                                ▼                      ▼
                ┌────────────────────────┐  ┌────────────────────────┐
                │ REMOTE 1: Orders MFE   │  │ REMOTE 2: Billing MFE  │
                │ (http://localhost:4201)│  │ (http://localhost:4202)│
                │ • Exposes ./Routes     │  │ • Exposes ./Routes     │
                │ • Independent Deploy   │  │ • Independent Deploy   │
                │ • Fallback on failure  │  │ • Fallback on failure  │
                └────────────────────────┘  └────────────────────────┘
</pre>
        </div>
      </section>

      <!-- Interactive Cross-MFE Communication Launcher -->
      <section class="interactive-section">
        <h3 class="section-title">Interactive Cross-MFE Communication Demos (PDF Page 12)</h3>
        <p class="section-subtitle">
          Experience the three decoupled communication techniques recommended for micro-frontends:
        </p>

        <div class="demo-grid">
          <!-- 1. URL Query Parameters -->
          <div class="demo-card">
            <div class="demo-num">1</div>
            <h4>URL & Route Parameters</h4>
            <p>Passes IDs and filters cleanly via the browser URL without tight coupling.</p>
            <div class="demo-buttons">
              <button class="btn btn-sm btn-cyan" (click)="navigateWithQueryParam('orders', 'CUST-501', 'ORD-901')">
                Filter Orders: CUST-501 (Highlight ORD-901) →
              </button>
              <button class="btn btn-sm btn-cyan" (click)="navigateWithQueryParam('billing', '', '', 'Acme')">
                Filter Billing: Acme Corp →
              </button>
            </div>
          </div>

          <!-- 2. Shared Auth / Session -->
          <div class="demo-card">
            <div class="demo-num">2</div>
            <h4>Shared Session / Auth Library</h4>
            <p>
              Current session: <strong class="text-accent">{{ authService.currentSession().username }}</strong>
              ({{ authService.currentSession().role }}). Remotes inherit this state automatically.
            </p>
            <div class="demo-buttons">
              <button class="btn btn-sm btn-outline-white" (click)="switchRole('Administrator')">
                Login Admin
              </button>
              <button class="btn btn-sm btn-outline-white" (click)="switchRole('DevOps')">
                Login DevOps
              </button>
              <button class="btn btn-sm btn-outline-white" (click)="switchRole('Store Manager')">
                Login Store Mgr
              </button>
            </div>
          </div>

          <!-- 3. DOM CustomEvent Bus -->
          <div class="demo-card">
            <div class="demo-num">3</div>
            <h4>Browser CustomEvent Bus</h4>
            <p>
              Lightweight pub/sub for cross-remote notifications without complex shared state.
            </p>
            <div class="demo-buttons">
              <button class="btn btn-sm btn-indigo" (click)="dispatchHostBroadcast()">
                Dispatch 'shell:broadcast' to Remotes
              </button>
              <span class="event-stat">
                Live Cart Count: <strong class="text-cyan">{{ toastService.cartEventCount() }}</strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Edge Cases & Resilience Section -->
      <section class="edge-cases-card">
        <h3 class="section-title">Edge Cases & Hardened Resilience (PDF Page 13)</h3>
        <div class="edge-grid">
          <div class="edge-item">
            <div class="edge-icon">🛡️</div>
            <div>
              <strong>Remote Server Offline Protection</strong>
              <p>
                Try stopping Port 4202 (Billing) and navigating to /billing. The Shell intercepts the rejection
                and displays an informative fallback card rather than crashing!
              </p>
            </div>
          </div>
          <div class="edge-item">
            <div class="edge-icon">🎨</div>
            <div>
              <strong>CSS Style Collision Isolation</strong>
              <p>
                Emulated encapsulation and scoped root selectors (<code>orders-remote-card</code>, <code>billing-remote-card</code>)
                prevent CSS leakage between remotes and the host.
              </p>
            </div>
          </div>
          <div class="edge-item">
            <div class="edge-icon">📦</div>
            <div>
              <strong>Strict Singleton Version Mismatches</strong>
              <p>
                Native Federation's <code>strictVersion: true</code> ensures incompatible major framework versions
                are caught early instead of triggering runtime injector corruptions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .dashboard-container { display: flex; flex-direction: column; gap: 2rem; }
    .hero-card {
      background: linear-gradient(135deg, #0e1e38 0%, #0a1120 100%);
      border: 1px solid #1e3a8a;
      border-radius: 16px;
      padding: 2.25rem;
    }
    .badge-pill {
      display: inline-block;
      padding: 0.35rem 0.85rem;
      background: rgba(59, 130, 246, 0.15);
      border: 1px solid rgba(59, 130, 246, 0.3);
      color: #60a5fa;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
    }
    .hero-card h1 { margin: 0 0 0.85rem 0; font-size: 2.2rem; color: #f8fafc; }
    .hero-desc { color: #94a3b8; font-size: 1rem; line-height: 1.6; max-width: 850px; margin: 0 0 1.5rem 0; }

    .server-topology-bar {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
      background: #060b17;
      border: 1px solid #1e293b;
      padding: 0.75rem 1.25rem;
      border-radius: 10px;
    }
    .server-pill {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #111827;
      border: 1px solid #374151;
      padding: 0.4rem 0.75rem;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      color: #f3f4f6;
    }
    .server-pill.active { border-color: #3b82f6; color: #93c5fd; }
    .server-pill.remote-1 { border-color: #2563eb; color: #60a5fa; }
    .server-pill.remote-2 { border-color: #8b5cf6; color: #c4b5fd; }
    .status-dot { width: 8px; height: 8px; border-radius: 50%; }
    .status-dot.green { background: #34d399; box-shadow: 0 0 6px #34d399; }
    .status-dot.blue { background: #38bdf8; box-shadow: 0 0 6px #38bdf8; }
    .status-dot.purple { background: #c084fc; box-shadow: 0 0 6px #c084fc; }
    .server-arrow { font-size: 0.75rem; color: #64748b; font-family: monospace; }

    .section-title { font-size: 1.25rem; color: #f1f5f9; margin: 0 0 0.5rem 0; }
    .section-subtitle { color: #94a3b8; font-size: 0.9rem; margin: 0 0 1.25rem 0; }

    .code-diagram {
      background: #020617;
      border: 1px solid #1e293b;
      border-radius: 12px;
      padding: 1.25rem;
      overflow-x: auto;
    }
    .code-diagram pre {
      margin: 0;
      color: #38bdf8;
      font-family: monospace;
      font-size: 0.85rem;
      line-height: 1.45;
    }

    .demo-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.25rem;
    }
    .demo-card {
      background: #0d1527;
      border: 1px solid #1e293b;
      border-radius: 10px;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      position: relative;
    }
    .demo-num {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: #1e293b;
      color: #38bdf8;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.8rem;
    }
    .demo-card h4 { margin: 0; color: #f8fafc; font-size: 1.05rem; }
    .demo-card p { margin: 0 0 0.5rem 0; color: #94a3b8; font-size: 0.85rem; line-height: 1.4; }
    .demo-buttons { display: flex; flex-direction: column; gap: 0.5rem; }
    .text-accent { color: #38bdf8; }
    .text-cyan { color: #38bdf8; }
    .event-stat { font-size: 0.8rem; color: #94a3b8; margin-top: 0.25rem; }

    .btn {
      padding: 0.45rem 0.85rem;
      border-radius: 6px;
      font-size: 0.825rem;
      cursor: pointer;
      font-weight: 600;
      border: 1px solid transparent;
      transition: all 0.2s;
      text-align: left;
    }
    .btn-sm { font-size: 0.8rem; padding: 0.4rem 0.75rem; }
    .btn-cyan { background: #0284c7; color: #fff; }
    .btn-cyan:hover { background: #0369a1; }
    .btn-indigo { background: #4f46e5; color: #fff; }
    .btn-indigo:hover { background: #4338ca; }
    .btn-outline-white { background: transparent; border-color: #475569; color: #f1f5f9; }
    .btn-outline-white:hover { background: #1e293b; border-color: #38bdf8; }

    .edge-cases-card {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 12px;
      padding: 1.5rem;
    }
    .edge-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.25rem;
      margin-top: 1rem;
    }
    .edge-item {
      display: flex;
      gap: 0.85rem;
      font-size: 0.875rem;
      color: #94a3b8;
    }
    .edge-icon { font-size: 1.5rem; }
    .edge-item strong { color: #f8fafc; display: block; margin-bottom: 0.25rem; }
    .edge-item p { margin: 0; line-height: 1.4; }
  `]
})
export class DashboardComponent {
  readonly toastService = inject(ToastService);
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  navigateWithQueryParam(path: string, customerId?: string, highlight?: string, client?: string): void {
    const queryParams: Record<string, string> = {};
    if (customerId) queryParams['customerId'] = customerId;
    if (highlight) queryParams['highlight'] = highlight;
    if (client) queryParams['client'] = client;

    this.toastService.show(
      'info',
      `Navigating to /${path} with decoupled query params: ${JSON.stringify(queryParams)}`,
      'URL Decoupled Route'
    );
    this.router.navigate([`/${path}`], { queryParams });
  }

  switchRole(role: 'Administrator' | 'DevOps' | 'Store Manager'): void {
    this.authService.switchUser(role);
    this.toastService.show(
      'success',
      `Active user switched to ${role}. Auth token propagated to shared storage.`,
      'Shared Auth Session'
    );
  }

  dispatchHostBroadcast(): void {
    window.dispatchEvent(
      new CustomEvent('shell:broadcast', {
        detail: { message: 'Shell announcement', time: new Date().toLocaleTimeString() }
      })
    );
    this.toastService.show(
      'info',
      "Host dispatched 'shell:broadcast' to window event bus.",
      'Event Bus Broadcast'
    );
  }
}
