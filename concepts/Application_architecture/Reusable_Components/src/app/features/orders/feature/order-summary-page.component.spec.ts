import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderSummaryPageComponent } from './order-summary-page.component';

describe('OrderSummaryPageComponent', () => {
  let fixture: ComponentFixture<OrderSummaryPageComponent>;
  let component: OrderSummaryPageComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderSummaryPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and show order card', () => {
    expect(component).toBeTruthy();
    const card = fixture.nativeElement.querySelector('app-info-card');
    expect(card).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Order #ORD-2026');
    expect(fixture.nativeElement.textContent).toContain('Vikram Sen');
  });

  it('should dismiss card when dismiss button is clicked', () => {
    const dismissBtn = fixture.nativeElement.querySelector('.dismiss-btn');
    expect(dismissBtn).toBeTruthy();

    dismissBtn.click();
    fixture.detectChanges();

    expect(component.isVisible()).toBe(false);
    expect(fixture.nativeElement.querySelector('app-info-card')).toBeFalsy();
  });

  it('should call cancelOrder when cancel button is clicked', () => {
    const cancelSpy = vi.spyOn(component, 'cancelOrder');
    const buttons = fixture.nativeElement.querySelectorAll('app-action-button button');
    // First button is "Cancel Order"
    buttons[0]?.click();

    expect(cancelSpy).toHaveBeenCalled();
  });

  it('should call approveOrder when approve button is clicked', () => {
    const approveSpy = vi.spyOn(component, 'approveOrder');
    const buttons = fixture.nativeElement.querySelectorAll('app-action-button button');
    // Second button is "Approve Shipment"
    buttons[1]?.click();

    expect(approveSpy).toHaveBeenCalled();
  });
});
