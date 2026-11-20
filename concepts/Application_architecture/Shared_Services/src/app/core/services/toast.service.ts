import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  text: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root' // Available app-wide as a tree-shakable singleton
})
export class ToastService {
  // Private writable signal so external components cannot corrupt the array directly
  private readonly messagesSignal = signal<ToastMessage[]>([]);

  // Public read-only signal for UI components to consume reactively
  readonly messages = this.messagesSignal.asReadonly();

  show(text: string, type: ToastType = 'info', durationMs = 3000): void {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const newToast: ToastMessage = { id, text, type };

    // Append new toast immutably
    this.messagesSignal.update((current) => [...current, newToast]);

    // Automatically remove the toast after durationMs
    setTimeout(() => this.dismiss(id), durationMs);
  }

  dismiss(id: number): void {
    this.messagesSignal.update((current) =>
      current.filter((toast) => toast.id !== id)
    );
  }
}
