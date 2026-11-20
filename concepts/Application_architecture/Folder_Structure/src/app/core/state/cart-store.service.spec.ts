import { TestBed } from '@angular/core/testing';
import { CartStoreService } from './cart-store.service';

describe('CartStoreService (Cross-Feature Shared Store)', () => {
  let service: CartStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartStoreService]
    });
    service = TestBed.inject(CartStoreService);
  });

  it('should initialize with default product in cart', () => {
    expect(service.items().length).toBe(1);
    expect(service.totalItemCount()).toBe(1);
  });

  it('should increment quantity when adding the same product', () => {
    service.addToCart({ id: 'PROD-101', name: 'Cloud Enterprise License', price: 1200 });
    expect(service.totalItemCount()).toBe(2);
    expect(service.subtotal()).toBe(2400);
  });

  it('should add a new product entry when adding different item', () => {
    service.addToCart({ id: 'PROD-999', name: 'New Gadget', price: 100 });
    expect(service.items().length).toBe(2);
    expect(service.totalItemCount()).toBe(2);
  });

  it('should remove item by ID', () => {
    service.removeItem('PROD-101');
    expect(service.items().length).toBe(0);
    expect(service.totalItemCount()).toBe(0);
  });
});
