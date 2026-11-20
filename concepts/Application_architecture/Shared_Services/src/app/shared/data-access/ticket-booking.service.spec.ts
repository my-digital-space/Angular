import { TestBed } from '@angular/core/testing';
import { TicketBookingService } from './ticket-booking.service';
import { NotifyService } from '../../core/services/notify.service';

describe('TicketBookingService', () => {
  let service: TicketBookingService;
  let notifyService: NotifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TicketBookingService, NotifyService]
    });
    service = TestBed.inject(TicketBookingService);
    notifyService = TestBed.inject(NotifyService);
  });

  it('should initialize with default 1 ticket and correct calculated prices', () => {
    expect(service.ticketCount()).toBe(1);
    expect(service.subtotal()).toBe(500);
    expect(service.gstAmount()).toBe(90); // 500 * 0.18 = 90
    expect(service.finalTotal()).toBe(590); // 500 + 90 = 590
  });

  it('should increment tickets and automatically update computed properties', () => {
    service.addTicket();
    expect(service.ticketCount()).toBe(2);
    expect(service.subtotal()).toBe(1000);
    expect(service.gstAmount()).toBe(180);
    expect(service.finalTotal()).toBe(1180);

    service.addTicket();
    expect(service.ticketCount()).toBe(3);
    expect(service.subtotal()).toBe(1500);
    expect(service.gstAmount()).toBe(270);
    expect(service.finalTotal()).toBe(1770);
  });

  it('should decrement tickets but never go below 1', () => {
    service.removeTicket(); // count is 1, should not decrement
    expect(service.ticketCount()).toBe(1);

    service.addTicket();
    service.addTicket();
    expect(service.ticketCount()).toBe(3);

    service.removeTicket();
    expect(service.ticketCount()).toBe(2);
    expect(service.subtotal()).toBe(1000);
    expect(service.finalTotal()).toBe(1180);
  });

  it('should confirm booking, notify with total, and reset ticket count to 1', () => {
    service.addTicket(); // count = 2, total = 1180
    service.confirmBooking();

    expect(notifyService.message()).toBe('Booked 2 ticket(s) for ₹1180!');
    expect(service.ticketCount()).toBe(1);
    expect(service.finalTotal()).toBe(590);
  });
});
