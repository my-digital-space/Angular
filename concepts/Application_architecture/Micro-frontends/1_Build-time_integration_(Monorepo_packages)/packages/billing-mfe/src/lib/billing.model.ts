export interface Invoice {
  id: string;
  client: string;
  service: string;
  total: number;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  dueDate: string;
}
