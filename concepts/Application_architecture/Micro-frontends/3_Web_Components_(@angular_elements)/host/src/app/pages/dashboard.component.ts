import {
  Component,
  ChangeDetectionStrategy,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  signal,
  EnvironmentInjector,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../services/toast.service';
import { registerChatWidgetCustomElement } from '../widgets/register-element';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dashboard-container">
      <!-- Hero Banner -->
      <section class="hero-card">
        <div class="badge-pill">Pattern 3 • Framework-Agnostic Micro-Apps</div>
        <h1>Web Components with &#64;angular/elements</h1>
        <p class="hero-desc">
          Package an Angular 22 component as a standard W3C Custom Element (<code>&lt;support-chat-widget&gt;</code>).
          It can be embedded into <strong>any web application</strong>—React, Vue, legacy AngularJS, or plain HTML—without
          sharing routers, dependencies, or runtimes.
        </p>

        <div class="pill-bar">
          <div class="pill-tag">
            <span class="dot emerald"></span> Custom Element: <code>&lt;support-chat-widget&gt;</code>
          </div>
          <div class="pill-tag">
            <span class="dot sky"></span> HTML Attribute &rarr; Signal Input Mapping
          </div>
          <div class="pill-tag">
            <span class="dot purple"></span> Shadow DOM Encapsulation
          </div>
        </div>
      </section>

      <!-- Architecture Diagram -->
      <section class="diagram-section">
        <h3 class="section-title">Web Component Host Integration Architecture</h3>
        <div class="code-diagram">
<pre>
Any Host Page (Angular Shell, React Portal, Vue Dashboard, or Plain HTML)
│
├── &lt;support-chat-widget user-id="USR-889"&gt;&lt;/support-chat-widget&gt;
│   │
│   ├── #shadow-root (open)  &lt;── 100% Isolated CSS / No global style collisions
│   │   │
│   │   ├── Signal Input:  readonly userId = input&lt;string&gt;()  (maps from 'user-id' attribute)
│   │   ├── Signal Output: readonly chatClosed = output&lt;void&gt;()  (dispatches CustomEvent)
│   │   └── Signal Output: readonly messageSent = output&lt;ChatMessage&gt;()
│   │
│   └── Self-contained headless Angular 22 runtime (createApplication)
</pre>
        </div>
      </section>

      <!-- Interactive Playground Card -->
      <section class="interactive-grid">
        <!-- Controller Panel -->
        <div class="control-box">
          <div class="box-header">
            <h3>Web Component Attribute Controller</h3>
            <span class="badge-accent">Live DOM Binding</span>
          </div>
          <p class="box-desc">
            Change the attributes bound to the custom element below to observe Signal Inputs reacting dynamically:
          </p>

          <div class="form-row">
            <label>Current User ID Attribute (<code>user-id</code>)</label>
            <div class="input-actions">
              <input type="text" [(ngModel)]="currentUserId" />
              <button class="btn btn-sm btn-primary" (click)="updateUserId('VIP-999')">
                Set VIP-999
              </button>
              <button class="btn btn-sm btn-secondary" (click)="updateUserId('GUEST-001')">
                Set Guest
              </button>
            </div>
          </div>

          <div class="action-buttons-row">
            <button class="btn btn-cyan" (click)="triggerHostToast()">
              Show Host Toast
            </button>
            <button class="btn btn-purple" (click)="toggleLegacyModal()">
              Preview Legacy Plain HTML Portal Embed
            </button>
          </div>
        </div>

        <!-- Captured CustomEvents Log -->
        <div class="event-log-box">
          <div class="box-header">
            <h3>Captured CustomEvents from &lt;support-chat-widget&gt;</h3>
            <span class="badge-count">{{ toastService.capturedEvents().length }} Events</span>
          </div>
          <p class="box-desc">
            The Host catches native DOM CustomEvents emitted by Angular 22 <code>output()</code>:
          </p>

          <div class="events-scroll">
            @if (toastService.capturedEvents().length === 0) {
              <div class="empty-state">
                Type a message in the bottom-right chat widget or close it to see CustomEvents captured here!
              </div>
            } @else {
              @for (entry of toastService.capturedEvents(); track entry.time + entry.event) {
                <div class="event-entry">
                  <div class="entry-header">
                    <span class="entry-tag">&lt;{{ entry.event }}&gt;</span>
                    <span class="entry-time">{{ entry.time }}</span>
                  </div>
                  <pre class="entry-json">{{ entry.detail | json }}</pre>
                </div>
              }
            }
          </div>
        </div>
      </section>

      <!-- Comparison Section -->
      <section class="comparison-card">
        <h3 class="section-title">When to Choose Angular Elements (Web Components)</h3>
        <div class="comp-grid">
          <div class="comp-col">
            <div class="col-icon">🎯</div>
            <h4>Best Use Cases</h4>
            <ul>
              <li><strong>Gradual Migration:</strong> Embedding new Angular 22 features inside an existing legacy AngularJS or React monolith.</li>
              <li><strong>Multi-Platform Micro-Apps:</strong> Distributing a single widget across dozens of partner portals with unknown tech stacks.</li>
              <li><strong>100% Guaranteed CSS Isolation:</strong> Shadow DOM guarantees zero chance of external CSS leaking in or out.</li>
            </ul>
          </div>
          <div class="comp-col">
            <div class="col-icon">⚖️</div>
            <h4>Trade-offs & Considerations</h4>
            <ul>
              <li><strong>Bundle Size:</strong> Headless Angular runtime must be packaged with the custom element script (~150-180 kB).</li>
              <li><strong>No Shared Routing:</strong> Custom Elements manage their own internal views or defer routing to the outer host.</li>
              <li><strong>Polyfills on Legacy Browsers:</strong> Requires standard Web Component customElements API.</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Legacy HTML Portal Modal Preview -->
      @if (showLegacyModal()) {
        <div class="modal-backdrop" (click)="toggleLegacyModal()">
          <div class="legacy-modal" (click)="$event.stopPropagation()">
            <div class="legacy-header">
              <div class="legacy-title">
                <span class="badge-legacy">External Portal</span>
                <h3>Simulated Legacy Server-Rendered HTML Portal</h3>
              </div>
              <button class="close-x" (click)="toggleLegacyModal()">×</button>
            </div>
            <div class="legacy-body">
              <p>
                This preview represents a non-Angular HTML page (like WordPress, ASP.NET, or Rails) that includes
                the Angular 22 web component bundle via a standard script tag:
              </p>
              <div class="code-snip">
                <code>&lt;support-chat-widget user-id="LEGACY-PORTAL-CUSTOMER"&gt;&lt;/support-chat-widget&gt;</code><br/>
                <code>&lt;script src="http://localhost:4203/main.js"&gt;&lt;/script&gt;</code>
              </div>
              <div class="mock-portal-canvas">
                <h2>Legacy Customer Account Portal (v1.4)</h2>
                <p>Welcome back, valued client. Below is your legacy billing statement.</p>
                <div class="mock-table">
                  <div>Statement #4092 &bull; Amount: \$1,200.00 &bull; Status: Settled</div>
                </div>
                <div class="widget-note">
                  &uarr; The live widget in the corner works identically inside this legacy page!
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- RENDER THE NATIVE ANGULAR ELEMENTS CUSTOM ELEMENT IN THE HOST! -->
      <support-chat-widget
        [attr.user-id]="currentUserId"
        (chatClosed)="onChatClosed()"
        (messageSent)="onMessageSent($event)"
      ></support-chat-widget>
    </div>
  `,
  styles: [`
    .dashboard-container { display: flex; flex-direction: column; gap: 2rem; }
    .hero-card {
      background: linear-gradient(135deg, #0e1e38 0%, #070d1a 100%);
      border: 1px solid #1e3a8a;
      border-radius: 16px;
      padding: 2.25rem;
    }
    .badge-pill {
      display: inline-block;
      padding: 0.35rem 0.85rem;
      background: rgba(14, 165, 233, 0.15);
      border: 1px solid rgba(14, 165, 233, 0.3);
      color: #38bdf8;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
    }
    .hero-card h1 { margin: 0 0 0.85rem 0; font-size: 2.2rem; color: #f8fafc; }
    .hero-desc { color: #94a3b8; font-size: 1rem; line-height: 1.6; max-width: 850px; margin: 0 0 1.5rem 0; }

    .pill-bar {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .pill-tag {
      background: #0b1324;
      border: 1px solid #1e293b;
      padding: 0.35rem 0.75rem;
      border-radius: 6px;
      font-size: 0.8rem;
      color: #e2e8f0;
      display: flex;
      align-items: center;
      gap: 0.45rem;
    }
    .dot { width: 8px; height: 8px; border-radius: 50%; }
    .dot.emerald { background: #34d399; }
    .dot.sky { background: #38bdf8; }
    .dot.purple { background: #c084fc; }

    .section-title { font-size: 1.25rem; color: #f1f5f9; margin: 0 0 1rem 0; }
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
      line-height: 1.5;
    }

    .interactive-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
      gap: 1.5rem;
    }
    .control-box, .event-log-box {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .box-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .box-header h3 { margin: 0; font-size: 1.1rem; color: #f8fafc; }
    .badge-accent {
      background: rgba(56, 189, 248, 0.15);
      color: #38bdf8;
      border: 1px solid rgba(56, 189, 248, 0.3);
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .badge-count {
      background: rgba(99, 102, 241, 0.15);
      color: #818cf8;
      border: 1px solid rgba(99, 102, 241, 0.3);
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .box-desc { color: #94a3b8; font-size: 0.85rem; margin: 0; line-height: 1.4; }

    .form-row {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      margin-top: 0.5rem;
    }
    .form-row label { font-size: 0.8rem; color: #94a3b8; }
    .input-actions {
      display: flex;
      gap: 0.5rem;
    }
    .input-actions input {
      flex: 1;
      background: #020617;
      border: 1px solid #334155;
      color: #f8fafc;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      font-size: 0.85rem;
    }
    .action-buttons-row {
      display: flex;
      gap: 0.75rem;
      margin-top: 0.5rem;
      flex-wrap: wrap;
    }

    .btn {
      padding: 0.45rem 0.85rem;
      border-radius: 6px;
      font-size: 0.825rem;
      cursor: pointer;
      font-weight: 600;
      border: none;
      transition: all 0.2s;
    }
    .btn-sm { padding: 0.35rem 0.65rem; font-size: 0.75rem; }
    .btn-primary { background: #0284c7; color: #fff; }
    .btn-primary:hover { background: #0369a1; }
    .btn-secondary { background: #334155; color: #fff; }
    .btn-secondary:hover { background: #475569; }
    .btn-cyan { background: #0891b2; color: #fff; }
    .btn-cyan:hover { background: #0e7490; }
    .btn-purple { background: #7c3aed; color: #fff; }
    .btn-purple:hover { background: #6d28d9; }

    .events-scroll {
      max-height: 240px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .empty-state {
      padding: 1.5rem;
      text-align: center;
      color: #64748b;
      font-size: 0.85rem;
      border: 1px dashed #334155;
      border-radius: 8px;
    }
    .event-entry {
      background: #020617;
      border: 1px solid #1e293b;
      border-radius: 6px;
      padding: 0.5rem 0.75rem;
    }
    .entry-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.25rem;
    }
    .entry-tag { color: #38bdf8; font-weight: 700; font-size: 0.8rem; font-family: monospace; }
    .entry-time { color: #64748b; font-size: 0.7rem; font-family: monospace; }
    .entry-json {
      margin: 0;
      color: #94a3b8;
      font-size: 0.75rem;
      font-family: monospace;
      white-space: pre-wrap;
    }

    .comparison-card {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 12px;
      padding: 1.5rem;
    }
    .comp-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }
    .comp-col h4 { margin: 0 0 0.75rem 0; color: #f8fafc; font-size: 1.05rem; }
    .comp-col ul { margin: 0; padding-left: 1.25rem; color: #94a3b8; font-size: 0.875rem; line-height: 1.6; }
    .comp-col li { margin-bottom: 0.5rem; }
    .comp-col strong { color: #e2e8f0; }
    .col-icon { font-size: 1.5rem; margin-bottom: 0.5rem; }

    .modal-backdrop {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0,0,0,0.8); z-index: 9999; display: flex; align-items: center; justify-content: center;
      backdrop-filter: blur(4px);
    }
    .legacy-modal {
      background: #1e293b; border: 1px solid #475569; border-radius: 12px;
      width: 90%; max-width: 650px; overflow: hidden;
    }
    .legacy-header {
      padding: 1rem 1.25rem; background: #0f172a; border-bottom: 1px solid #334155;
      display: flex; justify-content: space-between; align-items: center;
    }
    .legacy-title { display: flex; align-items: center; gap: 0.75rem; }
    .badge-legacy { background: #d97706; color: #fff; padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.7rem; font-weight: 700; }
    .legacy-header h3 { margin: 0; font-size: 1rem; color: #f8fafc; }
    .close-x { background: transparent; border: none; color: #94a3b8; font-size: 1.4rem; cursor: pointer; }
    .legacy-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
    .legacy-body p { margin: 0; color: #cbd5e1; font-size: 0.85rem; line-height: 1.4; }
    .code-snip { background: #020617; border: 1px solid #334155; padding: 0.75rem; border-radius: 6px; }
    .code-snip code { color: #38bdf8; font-family: monospace; font-size: 0.8rem; }
    .mock-portal-canvas {
      background: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 1.25rem;
    }
    .mock-portal-canvas h2 { margin: 0 0 0.5rem 0; color: #fbbf24; font-size: 1.1rem; }
    .mock-table { background: #020617; padding: 0.75rem; border-radius: 6px; font-size: 0.85rem; color: #94a3b8; }
    .widget-note { margin-top: 0.75rem; font-size: 0.75rem; color: #38bdf8; font-style: italic; }
  `]
})
export class DashboardComponent implements OnInit {
  private readonly injector = inject(EnvironmentInjector);
  readonly toastService = inject(ToastService);

  currentUserId = 'USR-889';
  readonly showLegacyModal = signal(false);

  ngOnInit(): void {
    // Register custom element in the browser
    registerChatWidgetCustomElement(this.injector);
  }

  updateUserId(newId: string): void {
    this.currentUserId = newId;
    this.toastService.show(
      'info',
      `Attribute 'user-id' updated to "${newId}". Propagated to Signal input.`,
      'HTML Attribute Update'
    );
  }

  onChatClosed(): void {
    this.toastService.logCapturedEvent('chatClosed', {
      action: 'Widget closed by user',
      userId: this.currentUserId
    });
  }

  onMessageSent(event: any): void {
    const detail = event?.detail || event;
    this.toastService.logCapturedEvent('messageSent', detail);
  }

  triggerHostToast(): void {
    this.toastService.show(
      'info',
      'Angular Elements wraps Angular 22 standalone components into standards-compliant Custom Elements.',
      'Pattern 3 Architecture'
    );
  }

  toggleLegacyModal(): void {
    this.showLegacyModal.update(v => !v);
  }
}
