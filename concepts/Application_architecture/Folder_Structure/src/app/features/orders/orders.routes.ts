import { Routes } from '@angular/router';
import { OrderListPageComponent } from './feature/order-list-page.component';

/**
 * Feature Route Configuration
 */
export const ORDER_ROUTES: Routes = [
  {
    path: '',
    component: OrderListPageComponent
  }
];
