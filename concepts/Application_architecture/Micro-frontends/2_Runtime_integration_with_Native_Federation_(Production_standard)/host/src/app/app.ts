import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastContainerComponent } from './components/toast-container.component';
import { ToastService } from './services/toast.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastContainerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly angularVersion = signal('Angular 22.3.0');
  readonly auth = inject(AuthService);
  readonly toast = inject(ToastService);

  testToast(): void {
    this.toast.show(
      'info',
      'Host Shell (Port 4200) is running with Native Federation and Dark Theme.',
      'Host Shell Notification'
    );
  }
}
