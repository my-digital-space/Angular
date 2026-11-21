import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastContainerComponent } from './components/toast-container.component';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastContainerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Pattern 1: Build-time Integration');
  protected readonly angularVersion = signal('Angular 22.3.0');
  private readonly toast = inject(ToastService);

  testToast(): void {
    this.toast.show(
      'info',
      'Host Application is running with dark theme and Angular 22 Standalone Architecture.',
      'Host Shell Notification'
    );
  }
}
