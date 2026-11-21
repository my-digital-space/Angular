import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BillingService } from './billing.service';
import { Invoice } from './billing.model';

@Component({
  selector: 'app-billing-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mfe-container">
      <!-- MFE Boundary Header -->
      <div class="mfe-header">
        <div class="mfe-badge">
          <span class="pulse-dot"></span>
          <span>Package: <code>@my-org/billing-mfe</code></span>
        </div>
        <span class="boundary-tag">Build-Time Monorepo Package</span>
      </div>

      <div class="info-banner">
        <div class="info-icon">💳</div>
        <div class="info-text">
          <h4>Billing Micro-Frontend Boundary</h4>
          <p>
            Owned by the Financial Engineering Team. Exposes <code>BILLING_MFE_ROUTES</code> via
            <code>src/public-api.ts</code>. The Host application resolves this package at build-time.
            Internal implementation details (such as payment processing logic) remain safely encapsulated inside this package.
          </p>
        </div>
      </div>

      <!-- Overview Stats -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-title">Total Outstanding</div>
          <div class="stat-value font-mono text-warning">\$12,700.00</div>
        </div>
        <div class="stat-card">
          <div class="stat-title">Collected (This Month)</div>
          <div class="stat-value font-mono text-success">\$12,500.00</div>
        </div>
        <div class="stat-card">
          <div class="stat-title">Active Accounts</div>
          <div class="stat-value font-mono text-info">3</div>
        </div>
      </div>

      <!-- Invoices Card -->
      <div class="controls-card">
        <div class="controls-header">
          <h3>Invoices & Billing Statements</h3>
          <button class="btn btn-primary" (click)="toggleNewInvoiceModal()">
            <span>+</span> Generate Invoice
          </button>
        </div>

        <div class="table-container">
          <table class="dark-table">
            <thead>
              <tr>
                <th>Invoice Number</th>
                <th>Client</th>
                <th>Service Description</th>
                <th>Total</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (invoice of billingService.invoices(); track invoice.id) {
                <tr>
                  <td class="font-mono text-accent">{{ invoice.id }}</td>
                  <td>{{ invoice.client }}</td>
                  <td>{{ invoice.service }}</td>
                  <td class="font-mono">\${{ invoice.total.toFixed(2) }}</td>
                  <td>{{ invoice.dueDate }}</td>
                  <td>
                    <span class="status-badge" [attr.data-status]="invoice.status">
                      {{ invoice.status }}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      @if (invoice.status !== 'Paid') {
                        <button class="btn btn-xs btn-outline-success" (click)="payInvoice(invoice.id)">
                          Mark Paid
                        </button>
                      }
                      <button class="btn btn-xs btn-outline" (click)="downloadReceipt(invoice)">
                        Receipt
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal -->
      @if (showAddModal()) {
        <div class="modal-backdrop" (click)="toggleNewInvoiceModal()">
          <div class="modal-box" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>Create Invoices in Billing-MFE</h3>
              <button class="close-btn" (click)="toggleNewInvoiceModal()">×</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>Client Organization</label>
                <input type="text" [(ngModel)]="newClient" placeholder="e.g. Stark Industries" />
              </div>
              <div class="form-group">
                <label>Service / Scope</label>
                <input type="text" [(ngModel)]="newService" placeholder="e.g. Cloud Hosting Q4" />
              </div>
              <div class="form-group">
                <label>Total Amount (\$)</label>
                <input type="number" [(ngModel)]="newTotal" placeholder="5000.00" />
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" (click)="toggleNewInvoiceModal()">Cancel</button>
              <button class="btn btn-primary" (click)="submitInvoice()">Issue Invoice</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .mfe-container {
      padding: 1.5rem;
      border: 1px solid #1e293b;
      border-radius: 12px;
      background: #0f172a;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    }
    .mfe-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #1e293b;
    }
    .mfe-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: #94a3b8;
    }
    .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #818cf8;
      box-shadow: 0 0 8px #818cf8;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }
    .boundary-tag {
      background: rgba(129, 140, 248, 0.12);
      color: #818cf8;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      border: 1px solid rgba(129, 140, 248, 0.25);
    }
    .info-banner {
      display: flex;
      gap: 1rem;
      background: #1e293b;
      border-left: 4px solid #818cf8;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }
    .info-icon { font-size: 1.5rem; }
    .info-text h4 { margin: 0 0 0.25rem 0; color: #f1f5f9; font-size: 1rem; }
    .info-text p { margin: 0; color: #94a3b8; font-size: 0.875rem; line-height: 1.4; }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .stat-card {
      background: #141e33;
      border: 1px solid #1e293b;
      border-radius: 8px;
      padding: 1rem;
    }
    .stat-title {
      font-size: 0.8rem;
      color: #94a3b8;
      margin-bottom: 0.35rem;
    }
    .stat-value {
      font-size: 1.4rem;
      font-weight: 700;
    }
    .text-warning { color: #fbbf24; }
    .text-success { color: #34d399; }
    .text-info { color: #38bdf8; }

    .controls-card {
      background: #141e33;
      border: 1px solid #1e293b;
      border-radius: 8px;
      padding: 1.25rem;
    }
    .controls-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .controls-header h3 { margin: 0; color: #f8fafc; font-size: 1.15rem; }
    .table-container { overflow-x: auto; }
    .dark-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
      text-align: left;
    }
    .dark-table th {
      padding: 0.75rem 1rem;
      background: #0f172a;
      color: #94a3b8;
      font-weight: 600;
      border-bottom: 1px solid #334155;
    }
    .dark-table td {
      padding: 0.85rem 1rem;
      border-bottom: 1px solid #1e293b;
      color: #cbd5e1;
    }
    .font-mono {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
    .text-accent {
      color: #818cf8;
      font-weight: 600;
    }
    .status-badge {
      display: inline-block;
      padding: 0.2rem 0.6rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .status-badge[data-status="Paid"] {
      background: rgba(52, 211, 153, 0.15);
      color: #34d399;
      border: 1px solid rgba(52, 211, 153, 0.3);
    }
    .status-badge[data-status="Unpaid"] {
      background: rgba(251, 191, 36, 0.15);
      color: #fbbf24;
      border: 1px solid rgba(251, 191, 36, 0.3);
    }
    .status-badge[data-status="Overdue"] {
      background: rgba(244, 63, 94, 0.15);
      color: #f43f5e;
      border: 1px solid rgba(244, 63, 94, 0.3);
    }
    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }
    .btn {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
      font-size: 0.875rem;
    }
    .btn-primary { background: #6366f1; color: #ffffff; }
    .btn-primary:hover { background: #4f46e5; }
    .btn-secondary { background: #334155; color: #f8fafc; }
    .btn-secondary:hover { background: #475569; }
    .btn-xs { padding: 0.25rem 0.5rem; font-size: 0.75rem; }
    .btn-outline-success {
      background: transparent;
      border: 1px solid #34d399;
      color: #34d399;
    }
    .btn-outline-success:hover { background: rgba(52, 211, 153, 0.15); }
    .btn-outline {
      background: transparent;
      border: 1px solid #64748b;
      color: #94a3b8;
    }
    .btn-outline:hover {
      background: rgba(100, 116, 139, 0.15);
      color: #f1f5f9;
    }
    .modal-backdrop {
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.75);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(4px);
    }
    .modal-box {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      width: 90%;
      max-width: 460px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
      overflow: hidden;
    }
    .modal-header {
      padding: 1rem 1.25rem;
      background: #0f172a;
      display: flex; justify-content: space-between; align-items: center;
      border-bottom: 1px solid #334155;
    }
    .modal-header h3 { margin: 0; color: #f8fafc; font-size: 1.1rem; }
    .close-btn { background: transparent; border: none; color: #94a3b8; font-size: 1.5rem; cursor: pointer; }
    .modal-body {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .form-group { display: flex; flex-direction: column; gap: 0.35rem; }
    .form-group label { font-size: 0.8rem; color: #94a3b8; font-weight: 500; }
    .form-group input {
      background: #0f172a;
      border: 1px solid #334155;
      color: #f8fafc;
      padding: 0.6rem 0.75rem;
      border-radius: 6px;
      font-size: 0.875rem;
    }
    .form-group input:focus { outline: none; border-color: #818cf8; }
    .modal-footer {
      padding: 0.85rem 1.25rem;
      background: #0f172a;
      border-top: 1px solid #334155;
      display: flex; justify-content: flex-end; gap: 0.75rem;
    }
  `]
})
export class BillingHomeComponent {
  readonly billingService = inject(BillingService);
  readonly showAddModal = signal(false);

  newClient = '';
  newService = '';
  newTotal: number | null = null;

  toggleNewInvoiceModal(): void {
    this.showAddModal.update(v => !v);
  }

  payInvoice(id: string): void {
    const inv = this.billingService.payInvoice(id);
    if (inv) {
      this.dispatchToast('success', `Invoice ${inv.id} for ${inv.client} marked as PAID.`, 'Billing-MFE');
    }
  }

  downloadReceipt(invoice: Invoice): void {
    this.dispatchToast('info', `Receipt for ${invoice.id} exported for client: ${invoice.client}`, 'Billing Service');
  }

  submitInvoice(): void {
    if (!this.newClient.trim() || !this.newService.trim() || !this.newTotal) {
      this.dispatchToast('warning', 'Please complete all invoice fields.');
      return;
    }

    const created = this.billingService.createInvoice({
      client: this.newClient.trim(),
      service: this.newService.trim(),
      total: Number(this.newTotal),
      status: 'Unpaid',
      dueDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0]
    });

    this.dispatchToast('success', `Issued ${created.id} to ${created.client} for \$${created.total.toFixed(2)}`, 'Billing-MFE');
    this.newClient = '';
    this.newService = '';
    this.newTotal = null;
    this.showAddModal.set(false);
  }

  private dispatchToast(type: 'success' | 'info' | 'warning' | 'error', message: string, title?: string): void {
    window.dispatchEvent(
      new CustomEvent('app-toast', {
        detail: { type, message, title: title ?? 'Billing-MFE' }
      })
    );
  }
}
