import { Component, ChangeDetectionStrategy, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

export interface OrderItem {
  id: string;
  item: string;
  customerId: string;
  status: 'Delivered' | 'In Transit' | 'Processing';
  amount: number;
}

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="orders-remote-card">
      <!-- Remote Header Badge -->
      <div class="remote-header">
        <div class="remote-badge">
          <span class="live-pulse"></span>
          <strong>REMOTE 1: Orders MFE</strong>
          <span class="port-tag">Port 4201</span>
        </div>
        <div class="protocol-tag">Native Federation • Runtime Dynamic Module</div>
      </div>

      <!-- Explanatory Callout -->
      <div class="callout-box">
        <div class="callout-icon">🌐</div>
        <div class="callout-text">
          <h4>Runtime Decoupled Micro-Frontend</h4>
          <p>
            This component was dynamically downloaded from <code>http://localhost:4201/remoteEntry.json</code>
            directly into the Host Shell. Angular core packages (<code>&#64;angular/core</code>, <code>&#64;angular/router</code>)
            are shared singletons and were <strong>downloaded only once</strong>.
          </p>
        </div>
      </div>

      <!-- Cross-MFE Communication Demo Panel -->
      <div class="comm-panel">
        <div class="comm-title">⚡ Cross-MFE Communication In Action</div>
        <div class="comm-grid">
          <!-- 1. URL Query Params -->
          <div class="comm-item">
            <span class="comm-label">1. URL Query Params:</span>
            <span class="comm-value">
              @if (activeCustomerId()) {
                Filtered by Customer: <code class="highlight">{{ activeCustomerId() }}</code>
              } @else {
                <span class="text-muted">No customerId query param in URL</span>
              }
            </span>
          </div>

          <!-- 2. Shared Auth Session -->
          <div class="comm-item">
            <span class="comm-label">2. Shared Session:</span>
            <span class="comm-value">
              User: <strong class="text-accent">{{ sessionUser() }}</strong>
              (Token: <code class="token-snip">{{ sessionToken() }}</code>)
            </span>
          </div>

          <!-- 3. Event Bus Dispatch -->
          <div class="comm-item">
            <span class="comm-label">3. Browser CustomEvent Bus:</span>
            <button class="btn btn-xs btn-event" (click)="dispatchCartUpdateEvent()">
              Dispatch 'cart:updated' Event to Shell
            </button>
          </div>
        </div>
      </div>

      <!-- Main Data Table -->
      <div class="table-card">
        <div class="table-header">
          <h3>Orders Catalog</h3>
          <div class="table-actions">
            <button class="btn btn-sm btn-primary" (click)="toggleAddModal()">
              + New Order
            </button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="dark-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Item Description</th>
                <th>Customer ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (order of filteredOrders(); track order.id) {
                <tr [class.highlighted-row]="order.id === highlightedId()">
                  <td class="font-mono text-cyan">{{ order.id }}</td>
                  <td>{{ order.item }}</td>
                  <td class="font-mono">{{ order.customerId }}</td>
                  <td class="font-mono">\${{ order.amount.toFixed(2) }}</td>
                  <td>
                    <span class="status-pill" [attr.data-status]="order.status">
                      {{ order.status }}
                    </span>
                  </td>
                  <td>
                    <div class="btn-group">
                      @if (order.status === 'Processing') {
                        <button class="btn btn-xs btn-outline-info" (click)="updateStatus(order.id, 'In Transit')">
                          Ship
                        </button>
                      } @else if (order.status === 'In Transit') {
                        <button class="btn btn-xs btn-outline-success" (click)="updateStatus(order.id, 'Delivered')">
                          Deliver
                        </button>
                      }
                      <button class="btn btn-xs btn-outline" (click)="notifyOrder(order)">
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

      <!-- Quick Add Modal -->
      @if (showAddModal()) {
        <div class="modal-overlay" (click)="toggleAddModal()">
          <div class="modal-card" (click)="$event.stopPropagation()">
            <div class="modal-title">
              <h3>Create Order on Port 4201</h3>
              <button class="close-x" (click)="toggleAddModal()">×</button>
            </div>
            <div class="modal-form">
              <div class="field">
                <label>Item Name</label>
                <input type="text" [(ngModel)]="newItem" placeholder="e.g. Ergonomic Keyboard" />
              </div>
              <div class="field">
                <label>Customer ID</label>
                <input type="text" [(ngModel)]="newCustId" placeholder="e.g. CUST-501" />
              </div>
              <div class="field">
                <label>Amount (\$)</label>
                <input type="number" [(ngModel)]="newAmount" placeholder="150.00" />
              </div>
            </div>
            <div class="modal-actions">
              <button class="btn btn-secondary" (click)="toggleAddModal()">Cancel</button>
              <button class="btn btn-primary" (click)="saveOrder()">Save Order</button>
            </div>
          </div>
        </div>
      }
    </section>
  `,
  styles: [`
    .orders-remote-card {
      border: 2px solid #2563eb;
      background: #0b1329;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 8px 30px rgba(37, 99, 235, 0.15);
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
      color: #93c5fd;
      font-size: 0.95rem;
    }
    .live-pulse {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #3b82f6;
      box-shadow: 0 0 10px #3b82f6;
      animation: pulse 1.8s infinite;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(0.8); opacity: 0.5; }
    }
    .port-tag {
      background: #1e3a8a;
      color: #bfdbfe;
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 700;
    }
    .protocol-tag {
      font-size: 0.75rem;
      background: rgba(37, 99, 235, 0.15);
      border: 1px solid rgba(37, 99, 235, 0.3);
      color: #60a5fa;
      padding: 0.25rem 0.65rem;
      border-radius: 9999px;
    }
    .callout-box {
      display: flex;
      gap: 1rem;
      background: #132247;
      border-left: 4px solid #3b82f6;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }
    .callout-icon { font-size: 1.5rem; }
    .callout-text h4 { margin: 0 0 0.25rem 0; color: #f1f5f9; font-size: 1rem; }
    .callout-text p { margin: 0; color: #94a3b8; font-size: 0.85rem; line-height: 1.4; }

    .comm-panel {
      background: #0f1c3f;
      border: 1px solid #1e3a8a;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1.5rem;
    }
    .comm-title {
      font-size: 0.85rem;
      font-weight: 700;
      color: #60a5fa;
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
    .highlight { background: rgba(56, 189, 248, 0.2); color: #38bdf8; padding: 0.1rem 0.4rem; border-radius: 4px; }
    .text-accent { color: #60a5fa; }
    .token-snip { font-size: 0.75rem; color: #cbd5e1; }
    .text-muted { color: #64748b; font-style: italic; }

    .table-card {
      background: #0a1124;
      border: 1px solid #1e293b;
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
      background: #080d1a;
      color: #94a3b8;
      border-bottom: 1px solid #1e293b;
    }
    .dark-table td {
      padding: 0.75rem;
      border-bottom: 1px solid #131d36;
      color: #cbd5e1;
    }
    .highlighted-row {
      background: rgba(37, 99, 235, 0.15) !important;
      border-left: 3px solid #3b82f6;
    }
    .font-mono { font-family: monospace; }
    .text-cyan { color: #38bdf8; font-weight: 600; }
    .status-pill {
      display: inline-block;
      padding: 0.15rem 0.5rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .status-pill[data-status="Delivered"] {
      background: rgba(52, 211, 153, 0.15); color: #34d399;
    }
    .status-pill[data-status="In Transit"] {
      background: rgba(56, 189, 248, 0.15); color: #38bdf8;
    }
    .status-pill[data-status="Processing"] {
      background: rgba(251, 191, 36, 0.15); color: #fbbf24;
    }
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
    .btn-primary { background: #2563eb; color: #fff; }
    .btn-primary:hover { background: #1d4ed8; }
    .btn-secondary { background: #334155; color: #fff; }
    .btn-event {
      background: #4f46e5;
      color: #fff;
      font-weight: 600;
      margin-top: 0.25rem;
      align-self: flex-start;
    }
    .btn-event:hover { background: #4338ca; }
    .btn-xs { padding: 0.25rem 0.5rem; font-size: 0.75rem; }
    .btn-sm { padding: 0.35rem 0.75rem; font-size: 0.8rem; }
    .btn-outline-info { background: transparent; border: 1px solid #38bdf8; color: #38bdf8; }
    .btn-outline-success { background: transparent; border: 1px solid #34d399; color: #34d399; }
    .btn-outline { background: transparent; border: 1px solid #475569; color: #94a3b8; }

    .modal-overlay {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center;
      z-index: 1000; backdrop-filter: blur(4px);
    }
    .modal-card {
      background: #0f1c3f; border: 1px solid #1e3a8a; border-radius: 12px;
      width: 90%; max-width: 440px; overflow: hidden;
    }
    .modal-title {
      padding: 1rem; background: #0a1124; display: flex; justify-content: space-between; align-items: center;
      border-bottom: 1px solid #1e3a8a;
    }
    .modal-title h3 { margin: 0; color: #f8fafc; font-size: 1rem; }
    .close-x { background: transparent; border: none; color: #94a3b8; font-size: 1.4rem; cursor: pointer; }
    .modal-form { padding: 1.25rem; display: flex; flex-direction: column; gap: 0.85rem; }
    .field { display: flex; flex-direction: column; gap: 0.3rem; }
    .field label { font-size: 0.8rem; color: #94a3b8; }
    .field input {
      background: #0a1124; border: 1px solid #1e3a8a; color: #fff; padding: 0.55rem;
      border-radius: 6px; font-size: 0.85rem;
    }
    .modal-actions {
      padding: 0.75rem 1rem; background: #0a1124; border-top: 1px solid #1e3a8a;
      display: flex; justify-content: flex-end; gap: 0.5rem;
    }
  `]
})
export class OrdersListComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);

  readonly recentOrders = signal<OrderItem[]>([
    { id: 'ORD-901', item: '4K UltraWide Monitor Arm', customerId: 'CUST-501', status: 'Delivered', amount: 249.99 },
    { id: 'ORD-902', item: 'Standing Desk Frame Dual-Motor', customerId: 'CUST-502', status: 'In Transit', amount: 489.00 },
    { id: 'ORD-903', item: 'Ergonomic Mesh Task Chair', customerId: 'CUST-501', status: 'Processing', amount: 329.50 },
    { id: 'ORD-904', item: 'Thunderbolt 4 Docking Station', customerId: 'CUST-503', status: 'Processing', amount: 219.00 }
  ]);

  readonly activeCustomerId = signal<string | null>(null);
  readonly highlightedId = signal<string | null>(null);
  readonly sessionUser = signal('admin@enterprise.io');
  readonly sessionToken = signal('eyJhbGciOi...jwt');
  readonly showAddModal = signal(false);

  newItem = '';
  newCustId = '';
  newAmount: number | null = null;

  ngOnInit(): void {
    // Read URL query parameters dynamically (Cross-MFE communication pattern 1)
    this.route.queryParams.subscribe(params => {
      if (params['customerId']) {
        this.activeCustomerId.set(params['customerId']);
      }
      if (params['highlight']) {
        this.highlightedId.set(params['highlight']);
      }
    });

    // Check shared local storage / session token (Cross-MFE communication pattern 2)
    const storedUser = localStorage.getItem('mfe_shared_user');
    const storedToken = localStorage.getItem('mfe_shared_token');
    if (storedUser) this.sessionUser.set(storedUser);
    if (storedToken) this.sessionToken.set(storedToken);
  }

  ngOnDestroy(): void {}

  filteredOrders() {
    const custId = this.activeCustomerId();
    if (!custId) return this.recentOrders();
    return this.recentOrders().filter(o => o.customerId.toLowerCase() === custId.toLowerCase());
  }

  toggleAddModal(): void {
    this.showAddModal.update(v => !v);
  }

  saveOrder(): void {
    if (!this.newItem.trim() || !this.newCustId.trim() || !this.newAmount) {
      this.dispatchToast('warning', 'Please fill in all order fields');
      return;
    }

    const newOrder: OrderItem = {
      id: `ORD-${Math.floor(100 + Math.random() * 900)}`,
      item: this.newItem.trim(),
      customerId: this.newCustId.trim(),
      status: 'Processing',
      amount: Number(this.newAmount)
    };

    this.recentOrders.update(orders => [newOrder, ...orders]);
    this.dispatchToast('success', `Created ${newOrder.id} for ${newOrder.customerId}`, 'Orders MFE (Port 4201)');

    // Emit event bus notification to shell
    window.dispatchEvent(
      new CustomEvent('cart:updated', {
        detail: { count: this.recentOrders().length, source: 'orders-mfe (Port 4201)' }
      })
    );

    this.newItem = '';
    this.newCustId = '';
    this.newAmount = null;
    this.showAddModal.set(false);
  }

  updateStatus(id: string, newStatus: OrderItem['status']): void {
    this.recentOrders.update(orders =>
      orders.map(o => o.id === id ? { ...o, status: newStatus } : o)
    );
    this.dispatchToast('info', `Order ${id} is now ${newStatus}`, 'Orders MFE (Port 4201)');
  }

  notifyOrder(order: OrderItem): void {
    this.dispatchToast('info', `Order ${order.id}: ${order.item} (${order.status})`, 'Orders MFE');
  }

  dispatchCartUpdateEvent(): void {
    const count = this.recentOrders().length;
    window.dispatchEvent(
      new CustomEvent('cart:updated', {
        detail: { count, source: 'orders-mfe (Port 4201)' }
      })
    );
    this.dispatchToast('info', `Dispatched 'cart:updated' event with count=${count}`, 'CustomEvent Bus');
  }

  private dispatchToast(type: 'success' | 'info' | 'warning' | 'error', message: string, title?: string): void {
    window.dispatchEvent(
      new CustomEvent('app-toast', {
        detail: { type, message, title: title ?? 'Orders-MFE' }
      })
    );
  }
}
