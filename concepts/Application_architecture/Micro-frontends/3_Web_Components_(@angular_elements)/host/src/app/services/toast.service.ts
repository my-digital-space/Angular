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
  readonly capturedEvents = signal<Array<{ event: string; detail: any; time: string }>>([]);

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('app-toast', (event: Event) => {
        const ce = event as CustomEvent<{
          type: 'success' | 'info' | 'warning' | 'error';
          message: string;
          title?: string;
        }>;
        if (ce.detail) {
          this.show(ce.detail.type, ce.detail.message, ce.detail.title);
        }
      });
    }
  }

  show(
    type: 'success' | 'info' | 'warning' | 'error',
    message: string,
    title = 'Web Component Notification',
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

  logCapturedEvent(eventName: string, detail: any): void {
    const entry = {
      event: eventName,
      detail,
      time: new Date().toLocaleTimeString()
    };
    this.capturedEvents.update(list => [entry, ...list.slice(0, 9)]);
    this.show('info', `Host intercepted DOM CustomEvent: <${eventName}>`, 'DOM CustomEvent Bus');
  }

  dismiss(id: string): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }
}
