import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toast-viewport" aria-live="polite">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast-card" [attr.data-type]="toast.type">
          <div class="toast-indicator"></div>
          <div class="toast-content">
            <div class="toast-header">
              <span class="toast-title">{{ toast.title }}</span>
              <span class="toast-time">{{ toast.timestamp }}</span>
            </div>
            <div class="toast-message">{{ toast.message }}</div>
          </div>
          <button class="toast-close" (click)="toastService.dismiss(toast.id)">×</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-viewport {
      position: fixed;
      top: 1.5rem;
      right: 1.5rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 380px;
      width: calc(100vw - 3rem);
      pointer-events: none;
    }
    .toast-card {
      pointer-events: auto;
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 10px;
      padding: 0.85rem 1rem;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5);
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      position: relative;
      overflow: hidden;
      animation: slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      backdrop-filter: blur(8px);
    }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .toast-indicator { width: 4px; height: 100%; position: absolute; top: 0; left: 0; }
    .toast-card[data-type="success"] .toast-indicator { background: #34d399; }
    .toast-card[data-type="info"] .toast-indicator { background: #38bdf8; }
    .toast-card[data-type="warning"] .toast-indicator { background: #fbbf24; }
    .toast-card[data-type="error"] .toast-indicator { background: #f43f5e; }
    .toast-content { flex: 1; padding-left: 0.25rem; }
    .toast-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.25rem; }
    .toast-title { font-size: 0.85rem; font-weight: 600; color: #f8fafc; }
    .toast-time { font-size: 0.7rem; color: #64748b; font-family: monospace; }
    .toast-message { font-size: 0.825rem; color: #cbd5e1; line-height: 1.35; }
    .toast-close { background: transparent; border: none; color: #64748b; font-size: 1.25rem; cursor: pointer; }
    .toast-close:hover { color: #f1f5f9; }
  `]
})
export class ToastContainerComponent {
  readonly toastService = inject(ToastService);
}
