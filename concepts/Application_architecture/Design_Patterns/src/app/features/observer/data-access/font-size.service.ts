import { Injectable, effect, signal } from '@angular/core';

/**
 * FontSizeService acts as the Subject in the Observer Pattern.
 * 
 * It holds the reactive state in a Signal (Subject).
 * The constructor establishes an effect() that observes every change
 * and automatically applies the style to the DOM (Side Effect Observer).
 */
@Injectable({
  providedIn: 'root'
})
export class FontSizeService {
  // 1. Subject: Reactive state
  readonly fontSizePx = signal<number>(16);

  constructor() {
    // 2. Observer (Side Effect): Automatically runs whenever fontSizePx changes
    effect(() => {
      const size = this.fontSizePx();
      // Apply CSS variable or root size
      if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty('--app-font-scale', `${size}px`);
      }
    });
  }

  increase(): void {
    this.fontSizePx.update(size => Math.min(26, size + 2));
  }

  decrease(): void {
    this.fontSizePx.update(size => Math.max(12, size - 2));
  }

  reset(): void {
    this.fontSizePx.set(16);
  }
}
