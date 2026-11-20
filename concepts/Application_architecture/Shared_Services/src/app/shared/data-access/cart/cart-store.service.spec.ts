import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { CartStoreService } from './cart-store.service';
import { ToastService } from '../../../core/services/toast.service';

describe('CartStoreService', () => {
  let service: CartStoreService;
  let httpTesting: HttpTestingController;
  let toastService: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CartStoreService,
        ToastService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(CartStoreService);
    httpTesting = TestBed.inject(HttpTestingController);
    toastService = TestBed.inject(ToastService);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be initialized with default mock item', () => {
    expect(service.items().length).toBe(1);
    expect(service.items()[0].productId).toBe('PRD-01');
    expect(service.totalItemCount()).toBe(1);
    expect(service.subtotal()).toBe(8500);
    expect(service.discountAmount()).toBe(0);
    expect(service.taxableAmount()).toBe(8500);
    expect(service.gstAmount()).toBe(1530); // 8500 * 0.18
    expect(service.grandTotal()).toBe(10030); // 8500 + 1530
  });

  it('should increment quantity when existing item is added', () => {
    service.addItem({
      productId: 'PRD-01',
      name: 'Ergonomic Split Keyboard',
      unitPrice: 8500
    });

    expect(service.items().length).toBe(1);
    expect(service.items()[0].quantity).toBe(2);
    expect(service.totalItemCount()).toBe(2);
    expect(service.subtotal()).toBe(17000);
  });

  it('should add a new item when non-existing item is added', () => {
    service.addItem({
      productId: 'PRD-02',
      name: 'Wireless Vertical Mouse',
      unitPrice: 3200
    });

    expect(service.items().length).toBe(2);
    expect(service.totalItemCount()).toBe(2);
    expect(service.subtotal()).toBe(11700);
  });

  it('should remove item when removeItem is invoked', () => {
    service.removeItem('PRD-01');
    expect(service.items().length).toBe(0);
    expect(service.totalItemCount()).toBe(0);
    expect(service.subtotal()).toBe(0);
    expect(service.grandTotal()).toBe(0);
  });

  it('should apply valid coupon SAVE10 and recalculate discount and grandTotal', () => {
    const success = service.applyCoupon('save10');
    expect(success).toBe(true);
    expect(service.appliedCoupon()).toBe('SAVE10');
    expect(service.discountAmount()).toBe(850); // 10% of 8500
    expect(service.taxableAmount()).toBe(7650); // 8500 - 850
    expect(service.gstAmount()).toBe(1377); // 7650 * 0.18
    expect(service.grandTotal()).toBe(9027); // 7650 + 1377
  });

  it('should reject invalid coupon and keep discount as 0', () => {
    const success = service.applyCoupon('DISCOUNT50');
    expect(success).toBe(false);
    expect(service.discountAmount()).toBe(0);
  });

  it('should submit order, clear cart, and reset coupon on HTTP success', () => {
    service.applyCoupon('SAVE10');
    service.submitOrder();

    expect(service.isCheckingOut()).toBe(true);

    const req = httpTesting.expectOne('/api/v1/checkout');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.coupon).toBe('SAVE10');

    req.flush({
      orderId: 'ORD-999',
      paidAmount: service.grandTotal(),
      timestamp: new Date().toISOString()
    });

    expect(service.isCheckingOut()).toBe(false);
    expect(service.items().length).toBe(0);
    expect(service.appliedCoupon()).toBeNull();
    expect(service.totalItemCount()).toBe(0);
  });
});
