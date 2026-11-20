import { TestBed } from '@angular/core/testing';
import { BookingPageComponent } from './booking-page.component';
import { TicketBookingService } from '../../shared/data-access/ticket-booking.service';
import { NotifyService } from '../../core/services/notify.service';

describe('BookingPageComponent', () => {
  let bookingService: TicketBookingService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingPageComponent],
      providers: [TicketBookingService, NotifyService]
    }).compileComponents();

    bookingService = TestBed.inject(TicketBookingService);
  });

  it('should render concert pass title and initial ₹590 total', async () => {
    const fixture = TestBed.createComponent(BookingPageComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.event-title')?.textContent).toContain('Concert Pass');
    expect(compiled.querySelector('.final-total')?.textContent).toContain('₹590');
  });

  it('should increase quantity when clicking + and update final total', async () => {
    const fixture = TestBed.createComponent(BookingPageComponent);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.qty-btn') as NodeListOf<HTMLButtonElement>;
    const plusBtn = buttons[1]; // [+] button
    plusBtn.click();

    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.ticket-qty')?.textContent?.trim()).toBe('2');
    expect(compiled.querySelector('.final-total')?.textContent).toContain('₹1180');
  });
});
