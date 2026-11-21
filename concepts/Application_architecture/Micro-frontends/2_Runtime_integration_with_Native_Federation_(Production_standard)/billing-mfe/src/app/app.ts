import { Component } from '@angular/core';
import { BillingListComponent } from './billing-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BillingListComponent],
  template: `
    <main style="padding: 2rem; max-width: 1000px; margin: 0 auto;">
      <h1 style="color: #c084fc; margin-bottom: 1.5rem;">Billing Remote MFE (Standalone Dev View - Port 4202)</h1>
      <app-billing-list></app-billing-list>
    </main>
  `
})
export class App {}
