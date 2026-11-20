import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { OrderCardComponent } from './order-card.component';
import { Order } from '../data-access/order.model';

describe('OrderCardComponent (ui/ Dumb Component)', () => {
  let fixture: ComponentFixture<OrderCardComponent>;
  let component: OrderCardComponent;
  let componentRef: ComponentRef<OrderCardComponent>;

  const mockOrder: Order = {
    id: 'ORD-999',
    customerName: 'Test Customer',
    subtotal: 1000,
    taxRate: 0.18,
    status: 'PENDING'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderCardComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    // Set signal input via ComponentRef.setInput
    componentRef.setInput('order', mockOrder);
    fixture.detectChanges();
  });

  it('should render customer name and order ID', () => {
    const nativeEl = fixture.nativeElement as HTMLElement;
    expect(nativeEl.querySelector('.customer-name')?.textContent).toContain('Test Customer');
    expect(nativeEl.querySelector('.order-id')?.textContent).toContain('ORD-999');
  });

  it('should compute derived total amount including tax', () => {
    // 1000 + (1000 * 0.18) = 1180
    expect(component.totalAmount()).toBe(1180);
  });

  it('should emit markDelivered output when button is clicked', () => {
    let emittedId = '';
    component.markDelivered.subscribe((id) => {
      emittedId = id;
    });

    const button = fixture.nativeElement.querySelector('.btn-action') as HTMLButtonElement;
    expect(button).toBeTruthy();
    button.click();

    expect(emittedId).toBe('ORD-999');
  });
});
