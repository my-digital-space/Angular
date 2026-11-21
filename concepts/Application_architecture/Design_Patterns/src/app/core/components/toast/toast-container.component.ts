import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [UpperCasePipe],
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastContainerComponent {
  protected readonly toastService = inject(ToastService);
  protected readonly toasts = this.toastService.toasts;

  onDismiss(toast: Toast): void {
    this.toastService.dismiss(toast.id);
  }
}
