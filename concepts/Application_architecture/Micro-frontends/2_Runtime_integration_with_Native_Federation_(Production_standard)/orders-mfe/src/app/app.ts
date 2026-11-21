import { Component } from '@angular/core';
import { OrdersListComponent } from './orders-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [OrdersListComponent],
  template: `
    <main style="padding: 2rem; max-width: 1000px; margin: 0 auto;">
      <h1 style="color: #38bdf8; margin-bottom: 1.5rem;">Orders Remote MFE (Standalone Dev View - Port 4201)</h1>
      <app-orders-list></app-orders-list>
    </main>
  `
})
export class App {}
