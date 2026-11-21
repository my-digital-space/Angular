import { Routes } from '@angular/router';
import { PAYMENT_STRATEGIES } from './data-access/payment-strategy.token';
import { UpiPaymentStrategy } from './data-access/strategies/upi-payment.strategy';
import { CardPaymentStrategy } from './data-access/strategies/card-payment.strategy';
import { NetBankingPaymentStrategy } from './data-access/strategies/netbanking-payment.strategy';
import { CryptoPaymentStrategy } from './data-access/strategies/crypto-payment.strategy';
import { PaymentContextService } from './data-access/payment-context.service';
import { StrategyPageComponent } from './feature/strategy-page.component';

export const STRATEGY_ROUTES: Routes = [
  {
    path: '',
    component: StrategyPageComponent,
    providers: [
      PaymentContextService,
      // Register multiple strategies into the same InjectionToken using { multi: true }
      // Want to add Apple Pay, PayPal or NetBanking later? Just add 1 line here!
      { provide: PAYMENT_STRATEGIES, useClass: UpiPaymentStrategy, multi: true },
      { provide: PAYMENT_STRATEGIES, useClass: CardPaymentStrategy, multi: true },
      { provide: PAYMENT_STRATEGIES, useClass: NetBankingPaymentStrategy, multi: true },
      { provide: PAYMENT_STRATEGIES, useClass: CryptoPaymentStrategy, multi: true }
    ]
  }
];
