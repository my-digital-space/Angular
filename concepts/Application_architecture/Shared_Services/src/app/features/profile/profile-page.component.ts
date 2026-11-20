import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NotifyService } from '../../core/services/notify.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfilePageComponent {
  private readonly notify = inject(NotifyService);

  onSave(): void {
    // One simple call updates the banner anywhere in the app
    this.notify.show('Profile saved!');
  }
}
