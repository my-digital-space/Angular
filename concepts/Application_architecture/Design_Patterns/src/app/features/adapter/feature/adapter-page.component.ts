import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockBackendService } from '../data-access/mock-backend.service';
import { adaptEmployee, Employee } from '../data-access/employee.adapter';
import { adaptRawOrderToUi, UiOrder } from '../data-access/order.adapter';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-adapter-page',
  standalone: true,
  imports: [CurrencyPipe, JsonPipe, RouterLink, FormsModule],
  templateUrl: './adapter-page.component.html',
  styleUrl: './adapter-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdapterPageComponent {
  private readonly backend = inject(MockBackendService);
  private readonly toastService = inject(ToastService);

  protected readonly activeTab = signal<'employees' | 'orders' | 'architecture'>('employees');

  // Employee signals: Raw DTO from backend
  protected readonly rawEmployees = this.backend.rawEmployees;

  // Clean UI models adapted in real time via computed()
  protected readonly uiEmployees = computed<Employee[]>(() =>
    this.rawEmployees().map(adaptEmployee)
  );

  // Orders signals: Raw DTO and Adapted UI models
  protected readonly rawOrders = this.backend.rawOrders;

  protected readonly uiOrders = computed<UiOrder[]>(() =>
    this.rawOrders().map(adaptRawOrderToUi)
  );

  // Interactive inputs
  protected newCustomerName = signal('Anita Deshmukh');
  protected newOrderRupees = signal(3499);

  onToggleEmployeeStatus(id: number): void {
    this.backend.toggleEmployeeStatus(id);
    this.toastService.info(`Toggled backend is_active_flag for Employee #${id}`, 'Adapter Updated');
  }

  onUpdateRawName(id: number, currentRaw: string): void {
    const promptName = prompt('Edit raw "full_nm" in backend API payload:', currentRaw);
    if (promptName !== null) {
      this.backend.updateEmployeeName(id, promptName);
      this.toastService.success(`Backend full_nm updated. Adapter cleanly trimmed it for the UI.`, 'Live Adapter');
    }
  }

  onCreateOrder(): void {
    const cust = this.newCustomerName().trim();
    const rupees = Number(this.newOrderRupees());
    if (cust && rupees > 0) {
      this.backend.addOrder(cust, rupees);
      this.toastService.success(
        `New order placed for ${cust} (Converted to ${rupees * 100} paise in backend DTO).`,
        'Order Adapted'
      );
    }
  }

  simulateBackendRefactor(): void {
    this.toastService.warning(
      'Simulated Schema Change: Backend changed "full_nm" -> "employee_name". Only 1 line in employee.adapter.ts was changed. Zero HTML templates broke!',
      'Backend Schema Shield'
    );
  }
}
