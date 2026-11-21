import { Component, signal, inject } from '@angular/core';
import { ToastContainerComponent } from './components/toast-container.component';
import { ToastService } from './services/toast.service';
import { DashboardComponent } from './pages/dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DashboardComponent, ToastContainerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly angularVersion = signal('Angular 22.3.0');
  readonly toast = inject(ToastService);

  testToast(): void {
    this.toast.show(
      'info',
      'Host Application (Port 4200) embedding Angular 22 Web Component <support-chat-widget>.',
      'Angular Elements Host Shell'
    );
  }
}
