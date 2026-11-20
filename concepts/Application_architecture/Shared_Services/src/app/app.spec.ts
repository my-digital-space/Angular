import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { TicketBookingService } from './shared/data-access/ticket-booking.service';
import { NotifyService } from './core/services/notify.service';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [TicketBookingService, NotifyService]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render navbar and ticket booking components', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-navbar')).toBeTruthy();
    expect(compiled.querySelector('app-booking-page')).toBeTruthy();
    expect(compiled.querySelector('app-notify-banner')).toBeTruthy();
  });
});
