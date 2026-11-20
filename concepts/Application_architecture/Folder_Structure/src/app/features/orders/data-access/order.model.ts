export type OrderStatus = 'PENDING' | 'SHIPPED' | 'DELIVERED';

export interface Order {
  id: string;
  customerName: string;
  subtotal: number;
  taxRate: number;
  status: OrderStatus;
}
