export interface Product {
  id: string;
  name: string;
  category: 'Software' | 'Hardware' | 'Services';
  price: number;
  discountRate: number;
  inStock: boolean;
}
