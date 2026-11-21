import { Injectable, signal } from '@angular/core';
import { EmployeeApiDto } from './employee.adapter';
import { RawOrderDto } from './order.adapter';

@Injectable({
  providedIn: 'root'
})
export class MockBackendService {
  // Simulates external REST API raw records
  readonly rawEmployees = signal<EmployeeApiDto[]>([
    {
      emp_id: 101,
      full_nm: '   Arun K. Sharma   ',
      is_active_flag: 'Y',
      dept_code: 'ENG',
      salary_cents: 9500000 // $95,000.00
    },
    {
      emp_id: 102,
      full_nm: 'Sarah Jenkins',
      is_active_flag: 'Y',
      dept_code: 'DES',
      salary_cents: 8200000 // $82,000.00
    },
    {
      emp_id: 103,
      full_nm: 'Rajesh Varma',
      is_active_flag: 'N',
      dept_code: 'FIN',
      salary_cents: 7500000 // $75,000.00
    }
  ]);

  readonly rawOrders = signal<RawOrderDto[]>([
    {
      ord_id: 'ORD-98214',
      cust_full_name: 'Priya Patel',
      total_in_paise: 499900, // ₹4,999.00
      created_epoch_ms: Date.now() - 3600000 * 2,
      order_status_code: 'COMP'
    },
    {
      ord_id: 'ORD-98215',
      cust_full_name: 'David Miller',
      total_in_paise: 125000, // ₹1,250.00
      created_epoch_ms: Date.now() - 3600000 * 5,
      order_status_code: 'PEND'
    }
  ]);

  updateEmployeeName(id: number, newRawName: string): void {
    this.rawEmployees.update(list =>
      list.map(emp => emp.emp_id === id ? { ...emp, full_nm: newRawName } : emp)
    );
  }

  toggleEmployeeStatus(id: number): void {
    this.rawEmployees.update(list =>
      list.map(emp => emp.emp_id === id ? { ...emp, is_active_flag: emp.is_active_flag === 'Y' ? 'N' : 'Y' } : emp)
    );
  }

  addOrder(customerName: string, amountRupees: number): void {
    const newOrder: RawOrderDto = {
      ord_id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      cust_full_name: customerName,
      total_in_paise: Math.round(amountRupees * 100),
      created_epoch_ms: Date.now(),
      order_status_code: 'COMP'
    };
    this.rawOrders.update(list => [newOrder, ...list]);
  }
}
