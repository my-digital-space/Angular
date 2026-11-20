import { Routes } from '@angular/router';
import { CustomerListPageComponent } from './feature/customer-list-page.component';

export const CUSTOMER_ROUTES: Routes = [
  {
    path: '',
    component: CustomerListPageComponent
  }
];
