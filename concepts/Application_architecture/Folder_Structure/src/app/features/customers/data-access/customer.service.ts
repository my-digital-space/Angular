import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Customer } from './customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly http = inject(HttpClient);

  private readonly customersState = signal<Customer[]>([
    {
      id: 'CUST-001',
      name: 'Ananya Sharma',
      company: 'Acme Cloud Solutions',
      email: 'ananya@acme.io',
      tier: 'Enterprise',
      joinedDate: '2025-01-15'
    },
    {
      id: 'CUST-002',
      name: 'Rohan Das',
      company: 'FinTech Dynamics',
      email: 'rohan@fintech.io',
      tier: 'Premium',
      joinedDate: '2025-03-20'
    },
    {
      id: 'CUST-003',
      name: 'Priya Patel',
      company: 'Logix Global',
      email: 'priya@logix.com',
      tier: 'Standard',
      joinedDate: '2025-07-10'
    }
  ]);

  readonly customers = this.customersState.asReadonly();
}
