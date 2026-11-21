import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { APP_CONFIG, PaymentGateway } from './core/config/app-tokens';
import { AuthStoreService, UserSessionReader } from './core/auth/auth-store.service';
import { SandboxMockGateway } from './core/services/payment-gateways';

describe('App Component', () => {
  let fixture: ComponentFixture<App>;
  let component: App;
  let authStore: AuthStoreService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        {
          provide: APP_CONFIG,
          useValue: {
            apiBaseUrl: 'https://test-api.example.in',
            enableDebugLogs: true,
            maxUploadSizeMb: 5,
          },
        },
        {
          provide: PaymentGateway,
          useClass: SandboxMockGateway,
        },
        {
          provide: UserSessionReader,
          useExisting: AuthStoreService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    authStore = TestBed.inject(AuthStoreService);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should render the brand title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand-title')?.textContent).toContain('Angular 22+ Production DI');
  });

  it('should cycle users using toggleUser()', () => {
    expect(component['currentAppUser']()).toBe('Aarav Mehta');

    component.toggleUser();
    expect(component['currentAppUser']()).toBe('Priya Sharma');

    component.toggleUser();
    expect(component['currentAppUser']()).toBeNull();

    component.toggleUser();
    expect(component['currentAppUser']()).toBe('Aarav Mehta');
  });
});
