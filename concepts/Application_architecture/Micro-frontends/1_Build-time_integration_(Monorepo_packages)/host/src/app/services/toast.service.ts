import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title?: string;
  message: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  readonly toasts = signal<ToastMessage[]>([]);

  constructor() {
    // Global listener for custom DOM event 'app-toast'
    if (typeof window !== 'undefined') {
      window.addEventListener('app-toast', (event: Event) => {
        const customEvent = event as CustomEvent<{
          type: 'success' | 'info' | 'warning' | 'error';
          message: string;
          title?: string;
        }>;
        if (customEvent.detail) {
          this.show(
            customEvent.detail.type,
            customEvent.detail.message,
            customEvent.detail.title
          );
        }
      });
    }
  }

  show(
    type: 'success' | 'info' | 'warning' | 'error',
    message: string,
    title?: string,
    durationMs = 4500
  ): void {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = {
      id,
      type,
      message,
      title: title || this.getDefaultTitle(type),
      timestamp: new Date().toLocaleTimeString()
    };

    this.toasts.update(list => [newToast, ...list]);

    if (durationMs > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, durationMs);
    }
  }

  dismiss(id: string): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }

  clearAll(): void {
    this.toasts.set([]);
  }

  private getDefaultTitle(type: string): string {
    switch (type) {
      case 'success': return 'Action Successful';
      case 'warning': return 'Attention Required';
      case 'error': return 'System Alert';
      default: return 'Notification';
    }
  }
}
