import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TicketBookingService } from '../../../shared/data-access/ticket-booking.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  protected readonly booking = inject(TicketBookingService);
}
