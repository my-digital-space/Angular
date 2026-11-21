import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

export interface InvoiceRecord {
  id: string;
  client: string;
  service: string;
  amount: number;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  dueDate: string;
}

@Component({
  selector: 'app-billing-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="billing-remote-card">
      <!-- Remote Header Badge -->
      <div class="remote-header">
        <div class="remote-badge">
          <span class="live-pulse"></span>
          <strong>REMOTE 2: Billing MFE</strong>
          <span class="port-tag">Port 4202</span>
        </div>
        <div class="protocol-tag">Native Federation • Runtime Dynamic Module</div>
      </div>

      <!-- Explanatory Callout -->
      <div class="callout-box">
        <div class="callout-icon">💳</div>
        <div class="callout-text">
          <h4>Independent Deployment on Port 4202</h4>
          <p>
            The Billing micro-frontend is deployed and served completely independently from Orders MFE and the Host Shell.
            If this server is taken offline, the Host Shell intercepts the failure gracefully using a route <code>.catch()</code>
            fallback component rather than crashing the application.
          </p>
        </div>
      </div>

      <!-- Cross-MFE Communication Demo Panel -->
      <div class="comm-panel">
        <div class="comm-title">⚡ Cross-MFE Communication In Action</div>
        <div class="comm-grid">
          <div class="comm-item">
            <span class="comm-label">1. URL Query Param:</span>
            <span class="comm-value">
              @if (filterClient()) {
                Filtered by Client: <code class="highlight">{{ filterClient() }}</code>
              } @else {
                <span class="text-muted">Showing all enterprise clients</span>
              }
            </span>
          </div>
          <div class="comm-item">
            <span class="comm-label">2. Shared Session:</span>
            <span class="comm-value">
              Authenticated: <strong class="text-emerald">{{ sessionUser() }}</strong>
            </span>
          </div>
          <div class="comm-item">
            <span class="comm-label">3. Event Bus Dispatch:</span>
            <button class="btn btn-xs btn-event" (click)="dispatchPaymentEvent()">
              Dispatch 'invoice:settled' to Shell
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Summary -->
      <div class="stats-grid">
        <div class="stat-pill">
          <span class="stat-num font-mono text-emerald">\$24,800.00</span>
          <span class="stat-lbl">Settled YTD</span>
        </div>
        <div class="stat-pill">
          <span class="stat-num font-mono text-amber">\$14,250.00</span>
          <span class="stat-lbl">Pending Review</span>
        </div>
        <div class="stat-pill">
          <span class="stat-num font-mono text-cyan">4 Invoices</span>
          <span class="stat-lbl">Active Ledger</span>
        </div>
      </div>

      <!-- Main Data Table -->
      <div class="table-card">
        <div class="table-header">
          <h3>Billing Ledger & Statements</h3>
          <button class="btn btn-sm btn-primary" (click)="toggleModal()">
            + Generate Invoice
          </button>
        </div>

        <div class="table-responsive">
          <table class="dark-table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Client</th>
                <th>Service</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (inv of filteredInvoices(); track inv.id) {
                <tr>
                  <td class="font-mono text-purple">{{ inv.id }}</td>
                  <td>{{ inv.client }}</td>
                  <td>{{ inv.service }}</td>
                  <td class="font-mono">\${{ inv.amount.toFixed(2) }}</td>
                  <td>{{ inv.dueDate }}</td>
                  <td>
                    <span class="status-pill" [attr.data-status]="inv.status">
                      {{ inv.status }}
                    </span>
                  </td>
                  <td>
                    <div class="btn-group">
                      @if (inv.status !== 'Paid') {
                        <button class="btn btn-xs btn-outline-success" (click)="payInvoice(inv.id)">
                          Mark Paid
                        </button>
                      }
                      <button class="btn btn-xs btn-outline" (click)="receiptNotification(inv)">
                        PDF Receipt
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add Modal -->
      @if (showAddModal()) {
        <div class="modal-overlay" (click)="toggleModal()">
          <div class="modal-card" (click)="$event.stopPropagation()">
            <div class="modal-title">
              <h3>Issue Invoice on Port 4202</h3>
              <button class="close-x" (click)="toggleModal()">×</button>
            </div>
            <div class="modal-form">
              <div class="field">
                <label>Client</label>
                <input type="text" [(ngModel)]="newClient" placeholder="e.g. Apex Dynamics" />
              </div>
              <div class="field">
                <label>Service Description</label>
                <input type="text" [(ngModel)]="newService" placeholder="e.g. Cloud API Consulting" />
              </div>
              <div class="field">
                <label>Amount (\$)</label>
                <input type="number" [(ngModel)]="newAmount" placeholder="3500.00" />
              </div>
            </div>
            <div class="modal-actions">
              <button class="btn btn-secondary" (click)="toggleModal()">Cancel</button>
              <button class="btn btn-primary" (click)="saveInvoice()">Issue Statement</button>
            </div>
          </div>
        </div>
      }
    </section>
  `,
  styles: [`
    .billing-remote-card {
      border: 2px solid #8b5cf6;
      background: #100b24;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 8px 30px rgba(139, 92, 246, 0.15);
    }
    .remote-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #1e293b;
    }
    .remote-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #c4b5fd;
      font-size: 0.95rem;
    }
    .live-pulse {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #a855f7;
      box-shadow: 0 0 10px #a855f7;
      animation: pulse 1.8s infinite;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(0.8); opacity: 0.5; }
    }
    .port-tag {
      background: #4c1d95;
      color: #ede9fe;
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 700;
    }
    .protocol-tag {
      font-size: 0.75rem;
      background: rgba(139, 92, 246, 0.15);
      border: 1px solid rgba(139, 92, 246, 0.3);
      color: #c4b5fd;
      padding: 0.25rem 0.65rem;
      border-radius: 9999px;
    }
    .callout-box {
      display: flex;
      gap: 1rem;
      background: #1e1338;
      border-left: 4px solid #a855f7;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }
    .callout-icon { font-size: 1.5rem; }
    .callout-text h4 { margin: 0 0 0.25rem 0; color: #f1f5f9; font-size: 1rem; }
    .callout-text p { margin: 0; color: #94a3b8; font-size: 0.85rem; line-height: 1.4; }

    .comm-panel {
      background: #180d30;
      border: 1px solid #3b1b68;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1.5rem;
    }
    .comm-title {
      font-size: 0.85rem;
      font-weight: 700;
      color: #c4b5fd;
      margin-bottom: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .comm-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1rem;
    }
    .comm-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.825rem;
    }
    .comm-label { color: #94a3b8; font-weight: 500; }
    .comm-value { color: #f8fafc; }
    .highlight { background: rgba(168, 85, 247, 0.2); color: #c084fc; padding: 0.1rem 0.4rem; border-radius: 4px; }
    .text-emerald { color: #34d399; }
    .text-muted { color: #64748b; font-style: italic; }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .stat-pill {
      background: #150f2e;
      border: 1px solid #281a4a;
      border-radius: 8px;
      padding: 0.85rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .stat-num { font-size: 1.25rem; font-weight: 700; }
    .stat-lbl { font-size: 0.75rem; color: #94a3b8; }
    .text-amber { color: #fbbf24; }
    .text-cyan { color: #38bdf8; }

    .table-card {
      background: #0d081d;
      border: 1px solid #231640;
      border-radius: 8px;
      padding: 1rem;
    }
    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }
    .table-header h3 { margin: 0; font-size: 1.1rem; color: #f8fafc; }
    .table-responsive { overflow-x: auto; }
    .dark-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
      text-align: left;
    }
    .dark-table th {
      padding: 0.75rem;
      background: #070410;
      color: #94a3b8;
      border-bottom: 1px solid #281a4a;
    }
    .dark-table td {
      padding: 0.75rem;
      border-bottom: 1px solid #1a1033;
      color: #cbd5e1;
    }
    .font-mono { font-family: monospace; }
    .text-purple { color: #c084fc; font-weight: 600; }
    .status-pill {
      display: inline-block;
      padding: 0.15rem 0.5rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .status-pill[data-status="Paid"] { background: rgba(52, 211, 153, 0.15); color: #34d399; }
    .status-pill[data-status="Unpaid"] { background: rgba(251, 191, 36, 0.15); color: #fbbf24; }
    .status-pill[data-status="Overdue"] { background: rgba(244, 63, 94, 0.15); color: #f43f5e; }

    .btn-group { display: flex; gap: 0.4rem; }
    .btn {
      padding: 0.45rem 0.9rem;
      border-radius: 6px;
      font-size: 0.825rem;
      cursor: pointer;
      font-weight: 500;
      border: 1px solid transparent;
      transition: all 0.2s;
    }
    .btn-primary { background: #7c3aed; color: #fff; }
    .btn-primary:hover { background: #6d28d9; }
    .btn-secondary { background: #334155; color: #fff; }
    .btn-event {
      background: #9333ea;
      color: #fff;
      font-weight: 600;
      margin-top: 0.25rem;
      align-self: flex-start;
    }
    .btn-event:hover { background: #7e22ce; }
    .btn-xs { padding: 0.25rem 0.5rem; font-size: 0.75rem; }
    .btn-sm { padding: 0.35rem 0.75rem; font-size: 0.8rem; }
    .btn-outline-success { background: transparent; border: 1px solid #34d399; color: #34d399; }
    .btn-outline { background: transparent; border: 1px solid #475569; color: #94a3b8; }

    .modal-overlay {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center;
      z-index: 1000; backdrop-filter: blur(4px);
    }
    .modal-card {
      background: #180d30; border: 1px solid #3b1b68; border-radius: 12px;
      width: 90%; max-width: 440px; overflow: hidden;
    }
    .modal-title {
      padding: 1rem; background: #0d081d; display: flex; justify-content: space-between; align-items: center;
      border-bottom: 1px solid #3b1b68;
    }
    .modal-title h3 { margin: 0; color: #f8fafc; font-size: 1rem; }
    .close-x { background: transparent; border: none; color: #94a3b8; font-size: 1.4rem; cursor: pointer; }
    .modal-form { padding: 1.25rem; display: flex; flex-direction: column; gap: 0.85rem; }
    .field { display: flex; flex-direction: column; gap: 0.3rem; }
    .field label { font-size: 0.8rem; color: #94a3b8; }
    .field input {
      background: #0d081d; border: 1px solid #3b1b68; color: #fff; padding: 0.55rem;
      border-radius: 6px; font-size: 0.85rem;
    }
    .modal-actions {
      padding: 0.75rem 1rem; background: #0d081d; border-top: 1px solid #3b1b68;
      display: flex; justify-content: flex-end; gap: 0.5rem;
    }
  `]
})
export class BillingListComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  readonly invoices = signal<InvoiceRecord[]>([
    { id: 'INV-401', client: 'Acme Corp', service: 'High Availability Multi-Region CDN', amount: 8900.00, status: 'Paid', dueDate: '2026-11-15' },
    { id: 'INV-402', client: 'Nexus Labs', service: 'Angular 22 Migration & Consulting', amount: 6400.00, status: 'Unpaid', dueDate: '2026-11-28' },
    { id: 'INV-403', client: 'Cyberdyne', service: 'Quarterly Infrastructure Retainer', amount: 9500.00, status: 'Paid', dueDate: '2026-11-10' },
    { id: 'INV-404', client: 'Stark Industries', service: 'Micro-Frontend Architecture Audit', amount: 7850.00, status: 'Overdue', dueDate: '2026-11-01' }
  ]);

  readonly filterClient = signal<string | null>(null);
  readonly sessionUser = signal('admin@enterprise.io');
  readonly showAddModal = signal(false);

  newClient = '';
  newService = '';
  newAmount: number | null = null;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['client']) {
        this.filterClient.set(params['client']);
      }
    });

    const storedUser = localStorage.getItem('mfe_shared_user');
    if (storedUser) this.sessionUser.set(storedUser);
  }

  filteredInvoices() {
    const client = this.filterClient();
    if (!client) return this.invoices();
    return this.invoices().filter(i => i.client.toLowerCase().includes(client.toLowerCase()));
  }

  toggleModal(): void {
    this.showAddModal.update(v => !v);
  }

  payInvoice(id: string): void {
    this.invoices.update(list =>
      list.map(i => i.id === id ? { ...i, status: 'Paid' } : i)
    );
    this.dispatchToast('success', `Invoice ${id} marked as PAID`, 'Billing MFE (Port 4202)');

    // Emit event bus notification to shell
    window.dispatchEvent(
      new CustomEvent('invoice:settled', {
        detail: { invoiceId: id, amount: 6400, source: 'billing-mfe (Port 4202)' }
      })
    );
  }

  receiptNotification(inv: InvoiceRecord): void {
    this.dispatchToast('info', `Receipt generated for ${inv.id} (${inv.client})`, 'Billing MFE');
  }

  saveInvoice(): void {
    if (!this.newClient.trim() || !this.newService.trim() || !this.newAmount) {
      this.dispatchToast('warning', 'Please fill in all invoice fields');
      return;
    }

    const newInv: InvoiceRecord = {
      id: `INV-${Math.floor(400 + Math.random() * 500)}`,
      client: this.newClient.trim(),
      service: this.newService.trim(),
      amount: Number(this.newAmount),
      status: 'Unpaid',
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
    };

    this.invoices.update(prev => [newInv, ...prev]);
    this.dispatchToast('success', `Issued ${newInv.id} to ${newInv.client}`, 'Billing MFE');
    this.newClient = '';
    this.newService = '';
    this.newAmount = null;
    this.showAddModal.set(false);
  }

  dispatchPaymentEvent(): void {
    window.dispatchEvent(
      new CustomEvent('invoice:settled', {
        detail: { invoiceId: 'INV-DEMO', amount: 5000, source: 'billing-mfe (Port 4202)' }
      })
    );
    this.dispatchToast('info', "Dispatched 'invoice:settled' to Shell custom event listener", 'CustomEvent Bus');
  }

  private dispatchToast(type: 'success' | 'info' | 'warning' | 'error', message: string, title?: string): void {
    window.dispatchEvent(
      new CustomEvent('app-toast', {
        detail: { type, message, title: title ?? 'Billing-MFE' }
      })
    );
  }
}
