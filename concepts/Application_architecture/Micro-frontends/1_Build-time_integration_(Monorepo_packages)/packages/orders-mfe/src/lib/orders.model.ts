export interface Order {
  id: string;
  customer: string;
  item: string;
  amount: number;
  status: 'Pending' | 'In Transit' | 'Delivered' | 'Cancelled';
  date: string;
}
