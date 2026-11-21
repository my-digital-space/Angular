import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthStoreService } from './core/auth/auth-store.service';
import { APP_CONFIG } from './core/config/app-tokens';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  // Direct access to AuthStoreService at root shell level for interactive session demonstration
  private readonly authStore = inject(AuthStoreService);
  protected readonly config = inject(APP_CONFIG);

  protected readonly currentAppUser = this.authStore.currentUserName;

  toggleUser(): void {
    const current = this.currentAppUser();
    if (!current) {
      this.authStore.login('Aarav Mehta');
    } else if (current === 'Aarav Mehta') {
      this.authStore.login('Priya Sharma');
    } else {
      this.authStore.logout();
    }
  }
}
