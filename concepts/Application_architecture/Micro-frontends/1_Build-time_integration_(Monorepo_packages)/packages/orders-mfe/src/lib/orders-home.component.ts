import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdersService } from './orders.service';
import { Order } from './orders.model';

// Interface for host toast injection if available
export interface ToastNotifier {
  show(type: 'success' | 'info' | 'warning' | 'error', message: string, title?: string): void;
}

@Component({
  selector: 'app-orders-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mfe-container">
      <!-- MFE Boundary Header -->
      <div class="mfe-header">
        <div class="mfe-badge">
          <span class="pulse-dot"></span>
          <span>Package: <code>@my-org/orders-mfe</code></span>
        </div>
        <span class="boundary-tag">Build-Time Monorepo Package</span>
      </div>

      <div class="info-banner">
        <div class="info-icon">📦</div>
        <div class="info-text">
          <h4>Orders Micro-Frontend Boundary</h4>
          <p>
            This feature module resides in <code>packages/orders-mfe</code> with its own <code>package.json</code> and
            strict <code>public-api.ts</code>. The Host Shell lazy-loads it at build-time via TypeScript path mappings.
            Both compile into a unified production distribution while keeping strict team boundaries.
          </p>
        </div>
      </div>

      <!-- Action & Filter Bar -->
      <div class="controls-card">
        <div class="controls-header">
          <h3>Recent Orders</h3>
          <button class="btn btn-primary" (click)="toggleNewOrderModal()">
            <span>+</span> New Order
          </button>
        </div>

        <!-- Orders Table -->
        <div class="table-container">
          <table class="dark-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Item / Spec</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (order of ordersService.orders(); track order.id) {
                <tr>
                  <td class="font-mono text-accent">{{ order.id }}</td>
                  <td>{{ order.customer }}</td>
                  <td>{{ order.item }}</td>
                  <td class="font-mono">\${{ order.amount.toFixed(2) }}</td>
                  <td>{{ order.date }}</td>
                  <td>
                    <span class="status-badge" [attr.data-status]="order.status">
                      {{ order.status }}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      @if (order.status === 'Pending') {
                        <button class="btn btn-xs btn-outline-success" (click)="advanceStatus(order, 'In Transit')">
                          Ship
                        </button>
                      } @else if (order.status === 'In Transit') {
                        <button class="btn btn-xs btn-outline-info" (click)="advanceStatus(order, 'Delivered')">
                          Deliver
                        </button>
                      }
                      <button class="btn btn-xs btn-outline" (click)="notifyOrderInfo(order)">
                        Inspect
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Interactive Quick Add Drawer / Modal -->
      @if (showAddModal()) {
        <div class="modal-backdrop" (click)="toggleNewOrderModal()">
          <div class="modal-box" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>Create Order in Orders-MFE</h3>
              <button class="close-btn" (click)="toggleNewOrderModal()">×</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>Customer Name</label>
                <input type="text" [(ngModel)]="newCustomer" placeholder="e.g. Wayne Enterprises" />
              </div>
              <div class="form-group">
                <label>Item Description</label>
                <input type="text" [(ngModel)]="newItem" placeholder="e.g. Mechanical Keyboard" />
              </div>
              <div class="form-group">
                <label>Amount (\$)</label>
                <input type="number" [(ngModel)]="newAmount" placeholder="199.99" />
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" (click)="toggleNewOrderModal()">Cancel</button>
              <button class="btn btn-primary" (click)="submitOrder()">Save Order</button>
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
      background: #38bdf8;
      box-shadow: 0 0 8px #38bdf8;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }
    .boundary-tag {
      background: rgba(56, 189, 248, 0.12);
      color: #38bdf8;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      border: 1px solid rgba(56, 189, 248, 0.25);
    }
    .info-banner {
      display: flex;
      gap: 1rem;
      background: #1e293b;
      border-left: 4px solid #38bdf8;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }
    .info-icon {
      font-size: 1.5rem;
    }
    .info-text h4 {
      margin: 0 0 0.25rem 0;
      color: #f1f5f9;
      font-size: 1rem;
    }
    .info-text p {
      margin: 0;
      color: #94a3b8;
      font-size: 0.875rem;
      line-height: 1.4;
    }
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
    .controls-header h3 {
      margin: 0;
      color: #f8fafc;
      font-size: 1.15rem;
    }
    .table-container {
      overflow-x: auto;
    }
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
      color: #38bdf8;
      font-weight: 600;
    }
    .status-badge {
      display: inline-block;
      padding: 0.2rem 0.6rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .status-badge[data-status="Delivered"] {
      background: rgba(52, 211, 153, 0.15);
      color: #34d399;
      border: 1px solid rgba(52, 211, 153, 0.3);
    }
    .status-badge[data-status="In Transit"] {
      background: rgba(56, 189, 248, 0.15);
      color: #38bdf8;
      border: 1px solid rgba(56, 189, 248, 0.3);
    }
    .status-badge[data-status="Pending"] {
      background: rgba(251, 191, 36, 0.15);
      color: #fbbf24;
      border: 1px solid rgba(251, 191, 36, 0.3);
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
    .btn-primary {
      background: #2563eb;
      color: #ffffff;
    }
    .btn-primary:hover {
      background: #1d4ed8;
    }
    .btn-secondary {
      background: #334155;
      color: #f8fafc;
    }
    .btn-secondary:hover {
      background: #475569;
    }
    .btn-xs {
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
    }
    .btn-outline-success {
      background: transparent;
      border: 1px solid #34d399;
      color: #34d399;
    }
    .btn-outline-success:hover {
      background: rgba(52, 211, 153, 0.15);
    }
    .btn-outline-info {
      background: transparent;
      border: 1px solid #38bdf8;
      color: #38bdf8;
    }
    .btn-outline-info:hover {
      background: rgba(56, 189, 248, 0.15);
    }
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
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.75);
      display: flex;
      align-items: center;
      justify-content: center;
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
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #334155;
    }
    .modal-header h3 {
      margin: 0;
      color: #f8fafc;
      font-size: 1.1rem;
    }
    .close-btn {
      background: transparent;
      border: none;
      color: #94a3b8;
      font-size: 1.5rem;
      cursor: pointer;
    }
    .modal-body {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .form-group label {
      font-size: 0.8rem;
      color: #94a3b8;
      font-weight: 500;
    }
    .form-group input {
      background: #0f172a;
      border: 1px solid #334155;
      color: #f8fafc;
      padding: 0.6rem 0.75rem;
      border-radius: 6px;
      font-size: 0.875rem;
    }
    .form-group input:focus {
      outline: none;
      border-color: #38bdf8;
    }
    .modal-footer {
      padding: 0.85rem 1.25rem;
      background: #0f172a;
      border-top: 1px solid #334155;
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }
  `]
})
export class OrdersHomeComponent {
  readonly ordersService = inject(OrdersService);
  readonly showAddModal = signal(false);

  newCustomer = '';
  newItem = '';
  newAmount: number | null = null;

  toggleNewOrderModal(): void {
    this.showAddModal.update(v => !v);
  }

  submitOrder(): void {
    if (!this.newCustomer.trim() || !this.newItem.trim() || !this.newAmount) {
      this.dispatchToast('warning', 'Please provide valid customer, item name, and price.');
      return;
    }

    const created = this.ordersService.addOrder({
      customer: this.newCustomer.trim(),
      item: this.newItem.trim(),
      amount: Number(this.newAmount),
      status: 'Pending'
    });

    this.dispatchToast('success', `Created ${created.id} for ${created.customer}`, 'Orders MFE');
    this.newCustomer = '';
    this.newItem = '';
    this.newAmount = null;
    this.showAddModal.set(false);
  }

  advanceStatus(order: Order, nextStatus: Order['status']): void {
    this.ordersService.updateStatus(order.id, nextStatus);
    this.dispatchToast('info', `Order ${order.id} status changed to ${nextStatus}`, 'Orders MFE');
  }

  notifyOrderInfo(order: Order): void {
    this.dispatchToast(
      'info',
      `Order ${order.id} (${order.item}) is currently ${order.status}`,
      'Order Inspection'
    );
  }

  private dispatchToast(type: 'success' | 'info' | 'warning' | 'error', message: string, title?: string): void {
    window.dispatchEvent(
      new CustomEvent('app-toast', {
        detail: { type, message, title: title ?? 'Orders-MFE' }
      })
    );
  }
}
