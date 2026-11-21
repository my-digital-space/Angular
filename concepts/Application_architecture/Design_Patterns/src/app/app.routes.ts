import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'facade',
    loadComponent: () =>
      import('./features/facade/feature/facade-page.component').then(m => m.FacadePageComponent)
  },
  {
    path: 'strategy',
    loadChildren: () =>
      import('./features/strategy/strategy.routes').then(m => m.STRATEGY_ROUTES)
  },
  {
    path: 'adapter',
    loadComponent: () =>
      import('./features/adapter/feature/adapter-page.component').then(m => m.AdapterPageComponent)
  },
  {
    path: 'observer',
    loadComponent: () =>
      import('./features/observer/feature/observer-page.component').then(m => m.ObserverPageComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
