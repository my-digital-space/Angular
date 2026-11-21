import { Routes } from '@angular/router';
import { CheckoutPageComponent } from './features/checkout/checkout-page.component';

export const routes: Routes = [
  {
    path: '',
    component: CheckoutPageComponent,
    title: 'Checkout | Production DI in Angular 22+',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
