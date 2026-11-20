import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NavbarComponent } from './core/layout/navbar/navbar.component';
import { NotifyBannerComponent } from './shared/ui/notify-banner/notify-banner.component';
import { BookingPageComponent } from './features/booking/booking-page.component';
import { ProfilePageComponent } from './features/profile/profile-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    NotifyBannerComponent,
    BookingPageComponent,
    ProfilePageComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {}
