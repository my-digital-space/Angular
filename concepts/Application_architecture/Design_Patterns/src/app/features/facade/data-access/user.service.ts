import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly userName = signal('Priya Nair');
  readonly userRole = signal('Lead Architect');
  readonly lastLogin = signal(new Date());

  setUserName(newName: string): void {
    if (newName.trim()) {
      this.userName.set(newName.trim());
    }
  }
}
