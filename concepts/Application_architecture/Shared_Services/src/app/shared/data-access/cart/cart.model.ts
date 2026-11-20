export interface CartItem {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

export interface OrderReceipt {
  orderId: string;
  paidAmount: number;
  timestamp: string;
}
