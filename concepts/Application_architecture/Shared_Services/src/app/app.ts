import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { NavbarComponent } from './core/layout/navbar/navbar.component';
import { ProductListComponent } from './features/catalog/product-list.component';
import { CheckoutPageComponent } from './features/checkout/feature/checkout-page.component';
import { ToastContainerComponent } from './shared/ui/toast-container/toast-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    ProductListComponent,
    CheckoutPageComponent,
    ToastContainerComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  protected readonly appTitle = signal('Angular 22+ Shared Services (Production Pattern)');
}
