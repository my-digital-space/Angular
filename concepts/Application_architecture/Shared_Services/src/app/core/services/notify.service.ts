import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {
  // Holds the current notification text (null = hidden)
  private readonly messageSignal = signal<string | null>(null);

  // Public read-only version for the HTML to read
  readonly message = this.messageSignal.asReadonly();

  show(text: string): void {
    this.messageSignal.set(text);
    // Hide automatically after 3 seconds
    setTimeout(() => {
      this.messageSignal.set(null);
    }, 3000);
  }
}
