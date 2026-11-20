import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CartStoreService } from '../../../shared/data-access/cart/cart-store.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  // Automatically updates whenever items are added/removed anywhere in the app
  protected readonly cartStore = inject(CartStoreService);
}
