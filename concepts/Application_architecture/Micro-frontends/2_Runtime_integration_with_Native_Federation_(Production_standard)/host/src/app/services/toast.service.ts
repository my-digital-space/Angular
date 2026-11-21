import { Injectable, signal } from '@angular/core';

export interface ToastItem {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  readonly toasts = signal<ToastItem[]>([]);
  readonly cartEventCount = signal<number>(4);
  readonly lastInvoiceSettled = signal<string | null>(null);

  constructor() {
    if (typeof window !== 'undefined') {
      // 1. Generic Toast listener
      window.addEventListener('app-toast', (event: Event) => {
        const ce = event as CustomEvent<{
          type: 'success' | 'info' | 'warning' | 'error';
          message: string;
          title?: string;
        }>;
        if (ce.detail) {
          this.show(ce.detail.type, ce.detail.message, ce.detail.title || 'MFE Event');
        }
      });

      // 2. CustomEvent Bus listener: cart:updated (PDF Page 12 Cross-MFE communication 3)
      window.addEventListener('cart:updated', (event: Event) => {
        const ce = event as CustomEvent<{ count: number; source: string }>;
        if (ce.detail) {
          this.cartEventCount.set(ce.detail.count);
          this.show(
            'info',
            `Received 'cart:updated' from ${ce.detail.source}. Total items: ${ce.detail.count}`,
            'DOM CustomEvent Bus'
          );
        }
      });

      // 3. CustomEvent Bus listener: invoice:settled
      window.addEventListener('invoice:settled', (event: Event) => {
        const ce = event as CustomEvent<{ invoiceId: string; amount: number; source: string }>;
        if (ce.detail) {
          this.lastInvoiceSettled.set(ce.detail.invoiceId);
          this.show(
            'success',
            `Payment cleared for ${ce.detail.invoiceId} (\${ce.detail.amount}) via ${ce.detail.source}`,
            'DOM CustomEvent Bus'
          );
        }
      });
    }
  }

  show(
    type: 'success' | 'info' | 'warning' | 'error',
    message: string,
    title = 'System Alert',
    durationMs = 4500
  ): void {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastItem = {
      id,
      type,
      title,
      message,
      timestamp: new Date().toLocaleTimeString()
    };

    this.toasts.update(list => [newToast, ...list]);

    if (durationMs > 0) {
      setTimeout(() => this.dismiss(id), durationMs);
    }
  }

  dismiss(id: string): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }
}
