import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  title?: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  show(message: string, type: ToastType = 'info', title?: string, durationMs = 4000): string {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newToast: Toast = {
      id,
      message,
      type,
      title: title || this.getDefaultTitle(type),
      timestamp: new Date()
    };

    this._toasts.update(current => [newToast, ...current.slice(0, 4)]);

    if (durationMs > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, durationMs);
    }

    return id;
  }

  success(message: string, title = 'Success'): string {
    return this.show(message, 'success', title);
  }

  info(message: string, title = 'Notice'): string {
    return this.show(message, 'info', title);
  }

  warning(message: string, title = 'Warning'): string {
    return this.show(message, 'warning', title);
  }

  error(message: string, title = 'Error'): string {
    return this.show(message, 'error', title);
  }

  dismiss(id: string): void {
    this._toasts.update(current => current.filter(t => t.id !== id));
  }

  clearAll(): void {
    this._toasts.set([]);
  }

  private getDefaultTitle(type: ToastType): string {
    switch (type) {
      case 'success': return 'Success';
      case 'info': return 'Information';
      case 'warning': return 'Warning';
      case 'error': return 'Error';
    }
  }
}
