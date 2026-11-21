import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    title: 'Pattern 1: Build-Time Integration | Angular 22 MFE'
  },
  {
    path: 'orders',
    loadChildren: () => import('@my-org/orders-mfe').then(m => m.ORDERS_MFE_ROUTES),
    title: 'Orders MFE | Monorepo Package'
  },
  {
    path: 'billing',
    loadChildren: () => import('@my-org/billing-mfe').then(m => m.BILLING_MFE_ROUTES),
    title: 'Billing MFE | Monorepo Package'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
