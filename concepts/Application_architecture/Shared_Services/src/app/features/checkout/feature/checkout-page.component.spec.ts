import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CheckoutPageComponent } from './checkout-page.component';
import { CartStoreService } from '../../../shared/data-access/cart/cart-store.service';

describe('CheckoutPageComponent', () => {
  let component: CheckoutPageComponent;
  let cartStore: CartStoreService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutPageComponent],
      providers: [
        CartStoreService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(CheckoutPageComponent);
    component = fixture.componentInstance;
    cartStore = TestBed.inject(CartStoreService);
    fixture.detectChanges();
  });

  it('should initialize and display order summary with default item', () => {
    expect(component).toBeTruthy();
    expect(cartStore.items().length).toBe(1);
    expect(cartStore.grandTotal()).toBe(10030);
  });

  it('should apply valid coupon code SAVE10 via onApplyCoupon', () => {
    // Set coupon input
    (component as unknown as { couponInput: { set: (val: string) => void } }).couponInput.set('SAVE10');
    component.onApplyCoupon();

    expect(cartStore.appliedCoupon()).toBe('SAVE10');
    expect(cartStore.discountAmount()).toBe(850);
  });
});
