import { TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { TicketBookingService } from '../../../shared/data-access/ticket-booking.service';
import { NotifyService } from '../../services/notify.service';

describe('NavbarComponent', () => {
  let bookingService: TicketBookingService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [TicketBookingService, NotifyService]
    }).compileComponents();

    bookingService = TestBed.inject(TicketBookingService);
  });

  it('should render initial ticket count', async () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.pill-count')?.textContent?.trim()).toBe('1');
  });

  it('should reactively update when ticket count changes in shared service', async () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();

    bookingService.addTicket();
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.pill-count')?.textContent?.trim()).toBe('2');
  });
});
