import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NotifyService } from '../../../core/services/notify.service';

@Component({
  selector: 'app-notify-banner',
  standalone: true,
  templateUrl: './notify-banner.component.html',
  styleUrl: './notify-banner.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotifyBannerComponent {
  // Inject the service so the HTML can read notify.message()
  protected readonly notify = inject(NotifyService);
}
