import { InjectionToken } from '@angular/core';

/**
 * Environment configuration interface for production dependency injection.
 */
export interface AppEnvironmentConfig {
  readonly apiBaseUrl: string;
  readonly enableDebugLogs: boolean;
  readonly maxUploadSizeMb: number;
}

/**
 * 1. InjectionToken allows Angular DI to inject plain TypeScript interfaces and objects.
 * Used with `useValue` provider strategy.
 */
export const APP_CONFIG = new InjectionToken<AppEnvironmentConfig>('APP_CONFIG');

/**
 * 2. Abstract class acts as both a TypeScript interface AND a runtime DI token.
 * Used with `useFactory` provider strategy for polymorphic runtime dispatching.
 */
export abstract class PaymentGateway {
  abstract processPayment(amountInr: number): Promise<string>;
}
