import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dashboard-container">
      <!-- Hero Section -->
      <section class="hero-card">
        <div class="hero-content">
          <div class="badge-pill">Pattern 1 • Monorepo Architecture</div>
          <h1>Build-Time Integration with Monorepo Packages</h1>
          <p class="hero-desc">
            In this pattern, feature modules live as standalone packages in a monorepo workspace (<code>packages/orders-mfe</code>, <code>packages/billing-mfe</code>) with distinct <code>package.json</code> files and strict <code>public-api.ts</code> contracts. They compile together at build time.
          </p>
          <div class="hero-actions">
            <a routerLink="/orders" class="btn btn-primary">
              Explore Orders MFE →
            </a>
            <a routerLink="/billing" class="btn btn-secondary">
              Explore Billing MFE →
            </a>
            <button class="btn btn-outline" (click)="triggerConceptToast()">
              Show Architecture Toast
            </button>
          </div>
        </div>
      </section>

      <!-- Architecture Visual Diagram -->
      <section class="diagram-section">
        <h3 class="section-title">Directory & Module Boundaries</h3>
        <div class="code-diagram">
<pre>
Workspace Root (1_Build-time_integration_(Monorepo_packages)/)
│
├── host/ (Angular 22 Host Application)
│   ├── tsconfig.json  ──> Path alias: "&#64;my-org/orders-mfe" & "&#64;my-org/billing-mfe"
│   └── src/app/app.routes.ts ──> Lazy-loads: import('&#64;my-org/orders-mfe')
│
├── packages/orders-mfe/ (Orders Team Domain)
│   ├── package.json  ──> Independent metadata & versioning
│   └── src/public-api.ts ──> Exposes ONLY public routes & contracts
│
└── packages/billing-mfe/ (Billing Team Domain)
    ├── package.json  ──> Independent metadata & versioning
    └── src/public-api.ts ──> Exposes ONLY public routes & contracts
</pre>
        </div>
      </section>

      <!-- Key Concept Comparison -->
      <section class="grid-two">
        <div class="info-card">
          <div class="card-icon">✅</div>
          <h3>Key Advantages</h3>
          <ul class="feature-list">
            <li><strong>Strict Code Boundaries:</strong> Clear ownership prevents spaghetti code across teams.</li>
            <li><strong>Zero Runtime Network Overhead:</strong> Chunks load directly via browser ESM without fetching external remoteEntry JSONs.</li>
            <li><strong>Type Safety:</strong> Host and packages share TypeScript types and DTO contracts natively at compile time.</li>
            <li><strong>Simplified Tooling:</strong> Uses standard Angular CLI application builder without needing Module Federation proxies.</li>
          </ul>
        </div>

        <div class="info-card">
          <div class="card-icon">⚠️</div>
          <h3>Important Trade-offs</h3>
          <ul class="feature-list">
            <li><strong>Coupled Deployment:</strong> Not true runtime micro-frontends. A bug fix in <code>orders-mfe</code> requires redeploying <code>host</code>.</li>
            <li><strong>Shared CI/CD Pipeline:</strong> A failing test or compile error in one package blocks the entire release.</li>
            <li><strong>All-or-Nothing Upgrades:</strong> All packages must be upgraded to Angular 22 simultaneously.</li>
          </ul>
        </div>
      </section>

      <!-- Interactive Concept Tests -->
      <section class="test-panel">
        <h3 class="section-title">Interactive Learning Controls</h3>
        <p class="panel-subtitle">Click below to test package boundaries and simulated state transitions:</p>
        <div class="action-grid">
          <button class="action-card" (click)="simulateBuildSimulation()">
            <span class="action-title">Simulate Build Pipeline</span>
            <span class="action-desc">Verifies package boundary resolution and path mapping</span>
          </button>
          <button class="action-card" (click)="simulatePublicApiCheck()">
            <span class="action-title">Verify Public API Contract</span>
            <span class="action-desc">Ensures private internals are not exposed across packages</span>
          </button>
          <button class="action-card" (click)="simulateLazyChunk()">
            <span class="action-title">Simulate Lazy Bundle Loading</span>
            <span class="action-desc">Triggers dynamic import route chunk resolution</span>
          </button>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    .hero-card {
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      border: 1px solid #334155;
      border-radius: 16px;
      padding: 2.5rem;
      position: relative;
      overflow: hidden;
    }
    .badge-pill {
      display: inline-block;
      padding: 0.35rem 0.85rem;
      background: rgba(56, 189, 248, 0.15);
      border: 1px solid rgba(56, 189, 248, 0.3);
      color: #38bdf8;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }
    .hero-card h1 {
      margin: 0 0 1rem 0;
      font-size: 2.25rem;
      color: #f8fafc;
      letter-spacing: -0.025em;
    }
    .hero-desc {
      color: #94a3b8;
      font-size: 1.05rem;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 0 1.75rem 0;
    }
    .hero-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .btn {
      padding: 0.65rem 1.25rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      border: 1px solid transparent;
    }
    .btn-primary { background: #2563eb; color: #fff; }
    .btn-primary:hover { background: #1d4ed8; }
    .btn-secondary { background: #4f46e5; color: #fff; }
    .btn-secondary:hover { background: #4338ca; }
    .btn-outline { background: transparent; border-color: #475569; color: #cbd5e1; }
    .btn-outline:hover { background: rgba(255, 255, 255, 0.05); color: #fff; }

    .section-title {
      font-size: 1.25rem;
      color: #f1f5f9;
      margin: 0 0 1rem 0;
    }
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
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.875rem;
      line-height: 1.5;
    }

    .grid-two {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.5rem;
    }
    .info-card {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 12px;
      padding: 1.5rem;
    }
    .card-icon {
      font-size: 1.75rem;
      margin-bottom: 0.75rem;
    }
    .info-card h3 {
      margin: 0 0 1rem 0;
      color: #f9fafb;
      font-size: 1.15rem;
    }
    .feature-list {
      margin: 0;
      padding-left: 1.25rem;
      color: #9ca3af;
      font-size: 0.9rem;
      line-height: 1.6;
    }
    .feature-list li {
      margin-bottom: 0.5rem;
    }
    .feature-list strong {
      color: #e5e7eb;
    }

    .test-panel {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 12px;
      padding: 1.5rem;
    }
    .panel-subtitle {
      color: #9ca3af;
      font-size: 0.9rem;
      margin: -0.5rem 0 1.25rem 0;
    }
    .action-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1rem;
    }
    .action-card {
      background: #1f2937;
      border: 1px solid #374151;
      border-radius: 8px;
      padding: 1.25rem;
      text-align: left;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .action-card:hover {
      background: #253347;
      border-color: #38bdf8;
      transform: translateY(-2px);
    }
    .action-title {
      font-size: 0.95rem;
      font-weight: 600;
      color: #f3f4f6;
    }
    .action-desc {
      font-size: 0.8rem;
      color: #9ca3af;
    }
  `]
})
export class DashboardComponent {
  private readonly toast = inject(ToastService);

  triggerConceptToast(): void {
    this.toast.show(
      'info',
      'Build-Time Integration compiles all workspace packages into one single deployment artifact.',
      'Architecture Overview'
    );
  }

  simulateBuildSimulation(): void {
    this.toast.show(
      'success',
      'Build succeeded: Host bundle + 2 feature chunks generated in 1.4s (Angular 22 application builder).',
      'Monorepo CI Runner'
    );
  }

  simulatePublicApiCheck(): void {
    this.toast.show(
      'info',
      'Verified: @my-org/orders-mfe and @my-org/billing-mfe expose only public-api.ts contracts.',
      'Boundary Linter'
    );
  }

  simulateLazyChunk(): void {
    this.toast.show(
      'info',
      'Lazy loading: import("@my-org/orders-mfe") resolves without full app reload.',
      'Router Engine'
    );
  }
}
