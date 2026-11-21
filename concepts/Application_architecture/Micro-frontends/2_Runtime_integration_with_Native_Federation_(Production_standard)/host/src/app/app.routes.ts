import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { DashboardComponent } from './pages/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    title: 'Pattern 2: Runtime Native Federation | Angular 22 MFE'
  },
  {
    path: 'orders',
    loadChildren: () =>
      loadRemoteModule('orders-mfe', './Routes')
        .then(m => m.ORDERS_ROUTES)
        .catch(err => {
          console.warn('[Host Shell] Orders remote unreachable. Activating Fallback:', err);
          return import('./fallbacks/orders-fallback.component').then(m => m.ORDERS_FALLBACK_ROUTES);
        }),
    title: 'Orders Remote MFE (Port 4201)'
  },
  {
    path: 'billing',
    loadChildren: () =>
      loadRemoteModule('billing-mfe', './Routes')
        .then(m => m.BILLING_ROUTES)
        .catch(err => {
          console.warn('[Host Shell] Billing remote unreachable. Activating Fallback:', err);
          return import('./fallbacks/billing-fallback.component').then(m => m.BILLING_FALLBACK_ROUTES);
        }),
    title: 'Billing Remote MFE (Port 4202)'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
