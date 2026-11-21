import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  protected readonly navItems = [
    { path: '/', label: 'Overview', exact: true },
    { path: '/facade', label: 'Facade Pattern', exact: false },
    { path: '/strategy', label: 'Strategy Pattern', exact: false },
    { path: '/adapter', label: 'Adapter Pattern', exact: false },
    { path: '/observer', label: 'Observer Pattern', exact: false }
  ];
}
