import { Injectable, signal } from '@angular/core';
import { Invoice } from './billing.model';

@Injectable({
  providedIn: 'root'
})
export class BillingService {
  readonly invoices = signal<Invoice[]>([
    {
      id: 'INV-2026-081',
      client: 'Acme Corp',
      service: 'Enterprise Cloud Infrastructure',
      total: 12500.00,
      status: 'Paid',
      dueDate: '2026-11-15'
    },
    {
      id: 'INV-2026-082',
      client: 'Nexus Labs',
      service: 'Micro-Frontend Consulting & Migration',
      total: 8200.00,
      status: 'Unpaid',
      dueDate: '2026-11-30'
    },
    {
      id: 'INV-2026-083',
      client: 'Cyberdyne Systems',
      service: 'Angular 22 Architecture Review',
      total: 4500.00,
      status: 'Overdue',
      dueDate: '2026-11-01'
    }
  ]);

  payInvoice(id: string): Invoice | undefined {
    let updatedInvoice: Invoice | undefined;
    this.invoices.update(invoices =>
      invoices.map(inv => {
        if (inv.id === id) {
          updatedInvoice = { ...inv, status: 'Paid' };
          return updatedInvoice;
        }
        return inv;
      })
    );
    return updatedInvoice;
  }

  createInvoice(inv: Omit<Invoice, 'id'>): Invoice {
    const newInv: Invoice = {
      ...inv,
      id: `INV-2026-${Math.floor(100 + Math.random() * 900)}`
    };
    this.invoices.update(prev => [newInv, ...prev]);
    return newInv;
  }
}
