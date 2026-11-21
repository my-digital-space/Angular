import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { CheckoutPageComponent } from './checkout-page.component';
import { APP_CONFIG, PaymentGateway } from '../../core/config/app-tokens';
import { UserSessionReader } from '../../core/auth/auth-store.service';

describe('CheckoutPageComponent (DI Testing & Contract Decoupling)', () => {
  let fixture: ComponentFixture<CheckoutPageComponent>;
  let component: CheckoutPageComponent;
  let mockPaymentGateway: { processPayment: (amount: number) => Promise<string> };
  let mockUserSignal = signal<string | null>('Test User');

  beforeEach(async () => {
    mockPaymentGateway = {
      processPayment: async (_amount: number) => 'TEST_TXN_9999',
    };

    const mockSessionReader: UserSessionReader = {
      currentUserName: mockUserSignal.asReadonly(),
    };

    await TestBed.configureTestingModule({
      imports: [CheckoutPageComponent],
      providers: [
        // 1. Swapping APP_CONFIG with lightweight test value
        {
          provide: APP_CONFIG,
          useValue: {
            apiBaseUrl: 'https://test-api.dev',
            enableDebugLogs: true,
            maxUploadSizeMb: 15,
          },
        },
        // 2. Swapping PaymentGateway with lightweight test mock
        {
          provide: PaymentGateway,
          useValue: mockPaymentGateway,
        },
        // 3. Providing mock UserSessionReader facade
        {
          provide: UserSessionReader,
          useValue: mockSessionReader,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the checkout page component', () => {
    expect(component).toBeTruthy();
  });

  it('should read session username from UserSessionReader contract', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.user-value')?.textContent).toContain('Test User');
  });

  it('should read config values from APP_CONFIG token', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.meta-code')?.textContent).toContain('https://test-api.dev');
    expect(compiled.querySelector('.meta-value')?.textContent).toContain('15 MB');
  });

  it('should process payment and update receiptId via PaymentGateway mock', async () => {
    await component.payNow();
    fixture.detectChanges();

    expect(component['receiptId']()).toBe('TEST_TXN_9999');

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.receipt-token')?.textContent).toContain('TEST_TXN_9999');
    expect(compiled.querySelector('.receipt-title')?.textContent).toContain('Payment Successful!');
  });

  it('should clear receipt when resetReceipt() is triggered', async () => {
    await component.payNow();
    expect(component['receiptId']()).toBe('TEST_TXN_9999');

    component.resetReceipt();
    fixture.detectChanges();

    expect(component['receiptId']()).toBeNull();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.receipt-box')).toBeNull();
  });
});
