import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TicketBookingService } from '../../shared/data-access/ticket-booking.service';

@Component({
  selector: 'app-booking-page',
  standalone: true,
  templateUrl: './booking-page.component.html',
  styleUrl: './booking-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookingPageComponent {
  protected readonly booking = inject(TicketBookingService);
}
