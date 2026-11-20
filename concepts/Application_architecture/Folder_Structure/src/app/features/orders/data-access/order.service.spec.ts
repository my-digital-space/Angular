import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { OrderService } from './order.service';

describe('OrderService (data-access/)', () => {
  let service: OrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OrderService,
        provideHttpClient()
      ]
    });
    service = TestBed.inject(OrderService);
  });

  it('should initialize with default orders in state signal', () => {
    const orders = service.orders();
    expect(orders.length).toBeGreaterThanOrEqual(2);
    expect(orders[0].id).toBe('ORD-101');
  });

  it('should update status to DELIVERED when markAsDelivered is invoked', () => {
    service.markAsDelivered('ORD-101');
    const updated = service.orders().find((o) => o.id === 'ORD-101');
    expect(updated?.status).toBe('DELIVERED');
  });
});
