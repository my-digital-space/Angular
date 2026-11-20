import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'products',
    // Lazy loaded Products feature
    loadChildren: () => import('./features/products').then((m) => m.PRODUCT_ROUTES)
  },
  {
    path: 'cart',
    // Lazy loaded Cart feature
    loadChildren: () => import('./features/cart').then((m) => m.CART_ROUTES)
  },
  {
    path: 'orders',
    // Lazy loaded Orders feature
    loadChildren: () => import('./features/orders').then((m) => m.ORDER_ROUTES)
  },
  {
    path: 'customers',
    // Lazy loaded Customers feature
    loadChildren: () => import('./features/customers').then((m) => m.CUSTOMER_ROUTES)
  },
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'products'
  }
];
