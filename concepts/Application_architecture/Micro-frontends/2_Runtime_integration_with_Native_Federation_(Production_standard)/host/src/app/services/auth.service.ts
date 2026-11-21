import { Injectable, signal } from '@angular/core';

export interface UserSession {
  username: string;
  role: 'Administrator' | 'DevOps' | 'Store Manager';
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly currentSession = signal<UserSession>({
    username: 'admin@enterprise.io',
    role: 'Administrator',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTcwMDAwMDAwMH0'
  });

  constructor() {
    this.syncStorage();
  }

  switchUser(role: UserSession['role']): void {
    const usernames: Record<UserSession['role'], string> = {
      'Administrator': 'admin@enterprise.io',
      'DevOps': 'sre.lead@enterprise.io',
      'Store Manager': 'store.manager@enterprise.io'
    };

    const newSession: UserSession = {
      username: usernames[role],
      role,
      token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ role, time: Date.now() }))}`
    };

    this.currentSession.set(newSession);
    this.syncStorage();
  }

  private syncStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const s = this.currentSession();
      localStorage.setItem('mfe_shared_user', s.username);
      localStorage.setItem('mfe_shared_role', s.role);
      localStorage.setItem('mfe_shared_token', s.token);
    }
  }
}
