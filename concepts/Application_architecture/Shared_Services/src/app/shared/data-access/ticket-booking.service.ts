import { Injectable, computed, inject, signal } from '@angular/core';
import { NotifyService } from '../../core/services/notify.service';

@Injectable({
  providedIn: 'root'
})
export class TicketBookingService {
  private readonly notify = inject(NotifyService);
  private readonly PRICE_PER_TICKET = 500;
  private readonly GST_RATE = 0.18;

  // 1. STATE: Tracks how many tickets are selected
  private readonly countSignal = signal<number>(1);
  readonly ticketCount = this.countSignal.asReadonly();

  // 2. DERIVED BUSINESS LOGIC: Automatically recalculates when countSignal changes
  readonly subtotal = computed(() => this.countSignal() * this.PRICE_PER_TICKET);
  readonly gstAmount = computed(() => Math.round(this.subtotal() * this.GST_RATE));
  readonly finalTotal = computed(() => this.subtotal() + this.gstAmount());

  // 3. ACTIONS: Safe methods to update the state
  addTicket(): void {
    this.countSignal.update((current) => current + 1);
  }

  removeTicket(): void {
    // Prevent going below 1 ticket
    if (this.countSignal() > 1) {
      this.countSignal.update((current) => current - 1);
    }
  }

  confirmBooking(): void {
    this.notify.show(`Booked ${this.ticketCount()} ticket(s) for ₹${this.finalTotal()}!`);
    this.countSignal.set(1); // Reset after booking
  }
}
