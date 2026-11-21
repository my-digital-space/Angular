import { ApplicationConfig, inject, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { APP_CONFIG, PaymentGateway } from './core/config/app-tokens';
import { RazorpayGateway, SandboxMockGateway } from './core/services/payment-gateways';
import { AuthStoreService, UserSessionReader } from './core/auth/auth-store.service';

const isProduction = false; // Toggle to switch implementations cleanly

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),

    // 1. useValue: Inject static environment configuration
    {
      provide: APP_CONFIG,
      useValue: {
        apiBaseUrl: 'https://api.example.in/v2',
        enableDebugLogs: !isProduction,
        maxUploadSizeMb: 10,
      },
    },

    // 2. useFactory: Dynamically choose which gateway class to instantiate
    {
      provide: PaymentGateway,
      useFactory: () => {
        const config = inject(APP_CONFIG);
        return config.enableDebugLogs
          ? new SandboxMockGateway()
          : new RazorpayGateway();
      },
    },

    // 3. useExisting: Maps UserSessionReader to the exact same AuthStoreService singleton
    {
      provide: UserSessionReader,
      useExisting: AuthStoreService,
    },
  ],
};
