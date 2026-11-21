import { Injectable, inject } from '@angular/core';
import { APP_CONFIG, PaymentGateway } from '../config/app-tokens';

/**
 * Concrete implementation for Razorpay payment processing.
 * Demonstrates injecting an InjectionToken inside an @Injectable service.
 */
@Injectable()
export class RazorpayGateway implements PaymentGateway {
  // Services can inject InjectionTokens just like regular services
  private readonly config = inject(APP_CONFIG);

  async processPayment(amountInr: number): Promise<string> {
    if (this.config.enableDebugLogs) {
      console.log(`[RazorpayGateway] Calling Razorpay via ${this.config.apiBaseUrl} for ₹${amountInr}`);
    }
    // Simulate real gateway network request
    await new Promise((resolve) => setTimeout(resolve, 800));
    return `RZP_TXN_${Date.now()}`;
  }
}

/**
 * Concrete implementation for Sandbox Mock payment processing.
 * Ideal for local development, staging, or integration testing.
 */
@Injectable()
export class SandboxMockGateway implements PaymentGateway {
  async processPayment(amountInr: number): Promise<string> {
    console.log(`[SandboxMockGateway] [SANDBOX] Simulated ₹${amountInr} payment`);
    // Simulate sandbox mock response
    await new Promise((resolve) => setTimeout(resolve, 600));
    return `MOCK_TXN_${Math.floor(1000 + Math.random() * 9000)}`;
  }
}
