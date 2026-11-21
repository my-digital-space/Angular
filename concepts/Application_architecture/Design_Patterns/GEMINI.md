# Angular 22+ Enterprise Software Design Patterns

> **CRITICAL ARCHITECTURAL DIRECTIVE: STRICT ANGULAR 22+ COMPLIANCE**
> All code, components, services, and routing in this project **strictly adhere to the latest Angular version 22+**. 
> - **Signals Exclusively**: Use `signal()`, `computed()`, and `effect()` for state management and derivations.
> - **Dependency Injection**: Utilize `inject()` exclusively; avoid legacy constructor-parameter injection syntax.
> - **Standalone Architecture**: 100% standalone components, directives, and pipes.
> - **Modern Control Flow**: Strictly use `@if`, `@else if`, `@else`, `@for ... track`, and `@switch` syntax.
> - **Change Detection**: Strict `ChangeDetectionStrategy.OnPush` across all feature components.
> - **Theme & UI**: High-contrast, dark-theme styling with interactive feedback via a Signal-based Toast notification system instead of raw `console.log`.

---

## Table of Contents
1. [Overview of Essential Angular Design Patterns](#1-overview-of-essential-angular-design-patterns)
2. [Architectural Comparison Matrix](#2-architectural-comparison-matrix)
3. [The Facade Pattern (Structural)](#3-the-facade-pattern-structural)
   - [What is it & Why is it Required?](#what-is-it--why-is-it-required)
   - [Architecture Flow Diagram](#facade-architecture-flow-diagram)
   - [Angular 22+ Implementation Walkthrough](#facade-angular-22-implementation-walkthrough)
   - [Real-World Enterprise Use Cases](#facade-real-world-enterprise-use-cases)
4. [The Strategy Pattern (Behavioral)](#4-the-strategy-pattern-behavioral)
   - [What is it & The Open/Closed Principle](#what-is-it--the-openclosed-principle)
   - [Architecture Flow Diagram](#strategy-architecture-flow-diagram)
   - [Multi-Provider InjectionToken Implementation Walkthrough](#strategy-multi-provider-injectiontoken-walkthrough)
   - [Signal-Driven Dynamic Strategy Swapping](#signal-driven-dynamic-strategy-swapping)
   - [Real-World Enterprise Use Cases](#strategy-real-world-enterprise-use-cases)
5. [The Adapter Pattern (Structural)](#5-the-adapter-pattern-structural)
   - [What is it & Backend-to-UI Shielding](#what-is-it--backend-to-ui-shielding)
   - [Architecture Flow Diagram](#adapter-architecture-flow-diagram)
   - [Pure Adapter Functions Walkthrough](#pure-adapter-functions-walkthrough)
   - [Real-World Enterprise Use Cases](#adapter-real-world-enterprise-use-cases)
6. [The Observer Pattern (Behavioral)](#6-the-observer-pattern-behavioral)
   - [What is it & Native Angular 22+ Reactivity](#what-is-it--native-angular-22-reactivity)
   - [Architecture Flow Diagram](#observer-architecture-flow-diagram)
   - [Signal Subjects, Computed Observers & effect() Walkthrough](#signals-and-effects-walkthrough)
   - [Real-World Enterprise Use Cases](#observer-real-world-enterprise-use-cases)
7. [Important Edge Cases, Anti-Patterns & Gotchas](#7-important-edge-cases-anti-patterns--gotchas)
8. [Comprehensive Trade-Off Analysis](#8-comprehensive-trade-off-analysis)
9. [Quick Decision Guide: Choosing the Right Pattern](#9-quick-decision-guide-choosing-the-right-pattern)
10. [Application Architecture & Interactive Demos](#10-application-architecture--interactive-demos)

---

## 1. Overview of Essential Angular Design Patterns

Design patterns are battle-tested, reusable architectural blueprints that solve recurring software development challenges. In large enterprise frontends, avoiding design patterns leads to:
- **Over-coupled components**: Page components injecting 6 to 8 disparate services directly, making testing and maintenance difficult.
- **Fragile `if / else` chains**: Adding a new payment gateway, export format, or discount rule requires editing existing battle-tested code—risking regressions.
- **Backend-to-UI fragility**: Backend teams renaming a single JSON field (`cust_full_name` to `customerName`) breaks 20+ HTML templates.
- **State desynchronization**: Manual DOM updates and imperative event coordination resulting in stale UI views and memory leaks.

Modern Angular 22+ provides native primitives that make implementing these patterns cleaner and more performant than ever:

```
┌────────────────────────────────────────────────────────────────────────┐
│                       Modern Angular 22+ Primitives                     │
├───────────────────┬───────────────────┬────────────────────────────────┤
│      inject()     │     signal()      │          computed()            │
│ Clean, functional │ Reactive subject  │ Glitch-free, memoized derived  │
│    DI lookup      │    state holder   │      reactive calculations     │
├───────────────────┼───────────────────┼────────────────────────────────┤
│     effect()      │  @if / @for track │         OnPush Strategy        │
│ Reactive side-    │ Built-in compile- │ Blazing performance, zero      │
│  effect runner    │ time control flow │ unnecessary change detections  │
└───────────────────┴───────────────────┴────────────────────────────────┘
```

---

## 2. Architectural Comparison Matrix

| Pattern | Category | Core Problem Solved | Angular 22+ Implementation Mechanism |
| :--- | :--- | :--- | :--- |
| **Facade** | Structural | Hides complex multi-service workflows behind one clean, simple API for UI components. | An `@Injectable()` service aggregating multiple stores/services privately via `computed()` signals. |
| **Strategy** | Behavioral | Swaps algorithms or business rules at runtime without fragile `if/else` ladders. | `InjectionToken<T[]>` registered with `{ multi: true }` or a dynamic signal switching mechanism. |
| **Adapter** | Structural | Converts messy, legacy external/backend data shapes into clean UI domain models. | Dedicated pure mapper functions or adapter classes inside `data-access/`. |
| **Observer** | Behavioral | Automatically notifies multiple parts of the UI when state changes without tight coupling. | Built natively into Angular via `signal()`, `computed()`, `effect()`, and RxJS `Observable`. |

---

## 3. The Facade Pattern (Structural)

### What is it & Why is it Required?
The **Facade pattern** places a single simplified service between your UI component and a group of complex underlying subsystem services. The UI component only talks to the Facade—it has no knowledge of how many services are working behind the scenes.

#### ❌ Without Facade (Bloated "God Component")
```
┌──────────────────────────────────────────────────────────────────────┐
│ CheckoutPageComponent (600+ lines)                                    │
│ • Injects 7 different services: Cart, Tax, User, Coupon, Wallet...   │
│ • Manages 15 reactive subscriptions and manual math calculations     │
│ • Unit test requires mocking 7 services and 30 internal methods      │
└──────────────────────────────────────────────────────────────────────┘
```

#### ✓ With Facade (Clean & Thin Component)
The component injects **only 1 service** (`CheckoutFacade`) and reads consolidated signals.

### Facade Architecture Flow Diagram

```
  ┌────────────────────────────────────────────────────────────┐
  │                 CheckoutSummaryComponent                  │
  │                  (Clean, Thin, OnPush)                     │
  └─────────────────────────────┬──────────────────────────────┘
                                │
                                │ inject(CheckoutFacade)
                                ▼
  ┌────────────────────────────────────────────────────────────┐
  │                       CheckoutFacade                       │
  │  • Single entry point for feature UI                       │
  │  • Coordinates underlying subsystems privately             │
  │  • Derives ready-to-render state via computed() signals   │
  └───────────────┬────────────────────────────┬───────────────┘
                  │                            │
                  ▼                            ▼
  ┌──────────────────────────────┐ ┌───────────────────────────┐
  │       CartItemsService       │ │   LoyaltyDiscountService  │
  │ (manages cart item signals)  │ │ (manages membership tier) │
  └──────────────────────────────┘ └───────────────────────────┘
```

### Facade Angular 22+ Implementation Walkthrough

#### Step A: Underlying Subsystem Services (`data-access/`)
```typescript
// features/checkout/data-access/cart-items.service.ts
import { Injectable, signal } from '@angular/core';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartItemsService {
  readonly items = signal<CartItem[]>([
    { id: 1, name: 'Mechanical Keyboard', price: 6000, quantity: 1 },
    { id: 2, name: 'USB-C Docking Hub', price: 2000, quantity: 1 }
  ]);
}
```

```typescript
// features/checkout/data-access/loyalty-discount.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoyaltyDiscountService {
  // 10% loyalty discount for returning members
  readonly discountRate = signal(0.10);
}
```

#### Step B: The Facade Service (`data-access/checkout.facade.ts`)
```typescript
// features/checkout/data-access/checkout.facade.ts
import { Injectable, computed, inject } from '@angular/core';
import { CartItemsService } from './cart-items.service';
import { LoyaltyDiscountService } from './loyalty-discount.service';

@Injectable({ providedIn: 'root' })
export class CheckoutFacade {
  // Facade coordinates multiple underlying services privately
  private readonly cartService = inject(CartItemsService);
  private readonly loyaltyService = inject(LoyaltyDiscountService);

  // Exposes clean, ready-to-render state to the UI
  readonly items = this.cartService.items;

  readonly subtotal = computed(() =>
    this.items().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  readonly discountAmount = computed(() =>
    Math.round(this.subtotal() * this.loyaltyService.discountRate())
  );

  readonly finalPayable = computed(() =>
    this.subtotal() - this.discountAmount()
  );
}
```

#### Step C: Clean Component Consuming Only the Facade
```typescript
// features/checkout/feature/checkout-summary.component.ts
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CheckoutFacade } from '../data-access/checkout.facade';

@Component({
  selector: 'app-checkout-summary',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './checkout-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckoutSummaryComponent {
  // Only 1 dependency instead of CartItemsService, LoyaltyDiscountService, TaxService, etc.!
  protected readonly facade = inject(CheckoutFacade);
}
```

#### Step D: Clean HTML Template (Modern Control Flow)
```html
<!-- features/checkout/feature/checkout-summary.component.html -->
<section class="checkout-card">
  <h3>Order Summary</h3>
  @for (item of facade.items(); track item.id) {
    <p>{{ item.name }}: {{ item.price | currency:'INR' }} (x{{ item.quantity }})</p>
  }
  <hr />
  <p>Subtotal: {{ facade.subtotal() | currency:'INR' }}</p>
  <p>Loyalty Discount: -{{ facade.discountAmount() | currency:'INR' }}</p>
  <h4>Final Payable: {{ facade.finalPayable() | currency:'INR' }}</h4>
</section>
```

### Facade Real-World Enterprise Use Cases
- **Enterprise Reporting Dashboard**: A `ReportingFacade` combining `DateFilterService`, `PermissionsService`, `ExportService`, and `AnalyticsApiService` so the dashboard view simply binds to `facade.reportRows()` and `facade.isLoading()`.
- **User Profile & Onboarding**: Combining `AuthService`, `UserProfileService`, `KycService`, and `NotificationPreferencesService` behind a single `UserProfileFacade`.

---

## 4. The Strategy Pattern (Behavioral)

### What is it & The Open/Closed Principle
The **Strategy pattern** defines a family of interchangeable algorithms, encapsulates each into its own class, and enables the application to select the right strategy dynamically at runtime.

#### The Open/Closed Principle (SOLID)
Software entities should be **open for extension**, but **closed for modification**.
- In typical codebases, adding a new payment gateway (e.g. NetBanking or Crypto) requires editing a giant `if / else` or `switch` block in the component or service.
- With the Strategy pattern + Angular `InjectionToken` (`multi: true`), adding a new strategy requires creating **one new class file** and **one provider registration line**. Existing tested code is untouched!

### Strategy Architecture Flow Diagram

```
                        PaymentProcessorService
                                   │
                                   │ inject(PAYMENT_STRATEGIES)
                                   ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ Injected Multi-Token Array:                                            │
 │ [ UpiPaymentStrategy, CardPaymentStrategy, NetBankingPaymentStrategy ] │
 └─────────────────────────────────┬──────────────────────────────────────┘
                                   │
                                   │ Finds strategy where type === selectedMethod()
                                   ▼
                    Executes activeStrategy.executePayment(amt)
                    (ZERO if / else chains inside any component!)
```

### Strategy Multi-Provider InjectionToken Walkthrough

#### Step A: Strategy Contract & Multi-Token (`data-access/payment-strategy.token.ts`)
```typescript
import { InjectionToken } from '@angular/core';

export type PaymentMethodType = 'UPI' | 'CARD' | 'NET_BANKING' | 'CRYPTO';

// Every payment strategy must follow this exact contract
export interface PaymentStrategy {
  readonly type: PaymentMethodType;
  readonly displayName: string;
  calculateFee(amount: number): number;
  executePayment(amount: number): string;
}

// Multi-token holds an array of all registered PaymentStrategy implementations
export const PAYMENT_STRATEGIES = new InjectionToken<PaymentStrategy[]>('PAYMENT_STRATEGIES');
```

#### Step B: Concrete Strategy Classes (`data-access/strategies/`)
```typescript
// upi-payment.strategy.ts
import { Injectable } from '@angular/core';
import { PaymentStrategy } from '../payment-strategy.token';

@Injectable()
export class UpiPaymentStrategy implements PaymentStrategy {
  readonly type = 'UPI' as const;
  readonly displayName = 'UPI (Zero Convenience Fee)';
  calculateFee(): number { return 0; }
  executePayment(amount: number): string {
    return `Paid ₹${amount} via UPI QR / Intent`;
  }
}
```

```typescript
// card-payment.strategy.ts
import { Injectable } from '@angular/core';
import { PaymentStrategy } from '../payment-strategy.token';

@Injectable()
export class CardPaymentStrategy implements PaymentStrategy {
  readonly type = 'CARD' as const;
  readonly displayName = 'Credit / Debit Card (2% Fee)';
  calculateFee(amount: number): number {
    return Math.round(amount * 0.02); // 2% gateway charge
  }
  executePayment(amount: number): string {
    const total = amount + this.calculateFee(amount);
    return `Paid ₹${total} via Card Gateway`;
  }
}
```

#### Step C: Context Service (`data-access/payment-context.service.ts`)
```typescript
import { Injectable, computed, inject, signal } from '@angular/core';
import { PAYMENT_STRATEGIES, PaymentMethodType, PaymentStrategy } from './payment-strategy.token';

@Injectable()
export class PaymentContextService {
  // Angular injects all classes registered under PAYMENT_STRATEGIES as an array
  private readonly strategies = inject(PAYMENT_STRATEGIES);

  // Lookup map for O(1) strategy retrieval
  private readonly strategyMap = new Map<PaymentMethodType, PaymentStrategy>(
    this.strategies.map(s => [s.type, s])
  );

  readonly availableMethods = this.strategies;
  readonly selectedMethod = signal<PaymentMethodType>('UPI');

  // Automatically resolves active strategy when selectedMethod changes
  readonly activeStrategy = computed(() => {
    const strategy = this.strategyMap.get(this.selectedMethod());
    if (!strategy) {
      throw new Error(`No payment strategy registered for ${this.selectedMethod()}`);
    }
    return strategy;
  });

  selectMethod(method: PaymentMethodType): void {
    this.selectedMethod.set(method);
  }

  process(baseAmount: number): string {
    // Delegates execution directly to active strategy class — zero conditionals!
    return this.activeStrategy().executePayment(baseAmount);
  }
}
```

#### Step D: Route-Level Multi-Provider Registration (`payment.routes.ts`)
```typescript
import { Routes } from '@angular/router';
import { PAYMENT_STRATEGIES } from './data-access/payment-strategy.token';
import { UpiPaymentStrategy } from './data-access/strategies/upi-payment.strategy';
import { CardPaymentStrategy } from './data-access/strategies/card-payment.strategy';
import { PaymentContextService } from './data-access/payment-context.service';
import { PaymentPageComponent } from './feature/payment-page.component';

export const PAYMENT_ROUTES: Routes = [
  {
    path: '',
    component: PaymentPageComponent,
    providers: [
      PaymentContextService,
      // Register multiple strategies into the same InjectionToken using multi: true
      { provide: PAYMENT_STRATEGIES, useClass: UpiPaymentStrategy, multi: true },
      { provide: PAYMENT_STRATEGIES, useClass: CardPaymentStrategy, multi: true }
      // Want to add NetBanking or Crypto later? Just add 1 line here!
    ]
  }
];
```

### Signal-Driven Dynamic Strategy Swapping
In scenarios where dependency injection is not required, the Strategy pattern can be cleanly implemented via Angular Signals:

```typescript
export interface ShippingStrategy {
  readonly label: string;
  calculateCost(orderWeightKg: number): number;
}

export class StandardShipping implements ShippingStrategy {
  readonly label = 'Standard Delivery (3-5 Days)';
  calculateCost(w: number): number { return 40 + w * 10; }
}

export class ExpressShipping implements ShippingStrategy {
  readonly label = 'Express Delivery (Next Day)';
  calculateCost(w: number): number { return 120 + w * 25; }
}

// Inside Component:
export class ShippingSelectorComponent {
  readonly weightKg = signal(2);
  readonly activeStrategy = signal<ShippingStrategy>(new StandardShipping());

  readonly shippingCost = computed(() =>
    this.activeStrategy().calculateCost(this.weightKg())
  );

  useStandard(): void { this.activeStrategy.set(new StandardShipping()); }
  useExpress(): void { this.activeStrategy.set(new ExpressShipping()); }
}
```

### Strategy Real-World Enterprise Use Cases
- **Document & Report Exporters**: Registering `PdfExportStrategy`, `ExcelExportStrategy`, and `CsvExportStrategy` under `REPORT_EXPORTERS (multi: true)`. The toolbar dynamically generates export buttons from registered providers.
- **Dynamic Form Validation**: A KYC onboarding portal that swaps validation strategies (`PanCardValidationStrategy`, `AadhaarValidationStrategy`, `PassportValidationStrategy`) dynamically based on ID selection.

---

## 5. The Adapter Pattern (Structural)

### What is it & Backend-to-UI Shielding
The **Adapter pattern** acts like a travel power plug adapter. It translates raw, messy, or legacy data structures returned by external APIs (or third-party libraries) into clean, predictable TypeScript domain models before components ever consume them.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Backend-to-UI Fragility Problem                 │
├────────────────────────────────────────────────────────────────────────┤
│ Backend REST API (snake_case, paise, legacy fields):                   │
│   { "emp_id": 101, "full_nm": " Arun ", "is_active_flag": "Y" }        │
│                                                                        │
│ ❌ Without Adapter: 20 HTML templates bind directly to `full_nm`.      │
│   Backend renames `full_nm` to `employee_name` -> ALL 20 templates break!│
│                                                                        │
│ ✓ With Adapter: Only 1 mapper function in `data-access/` changes.     │
│   UI components bind to `employee.name` -> ZERO templates break!       │
└────────────────────────────────────────────────────────────────────────┘
```

### Adapter Architecture Flow Diagram

```
 Backend JSON Response             Adapter Function                 Angular UI Model
┌─────────────────────────┐     ┌──────────────────────┐     ┌────────────────────────┐
│ {                       │     │                      │     │ {                      │
│   emp_id: 101,          │ ──► │  adaptEmployeeDto()  │ ──► │   id: 101,             │
│   full_nm: " Arun ",    │     │                      │     │   name: "Arun",        │
│   is_active_flag: "Y"   │     │                      │     │   isActive: true       │
│ }                       │     │                      │     │ }                      │
└─────────────────────────┘     └──────────────────────┘     └────────────────────────┘
```

### Pure Adapter Functions Walkthrough

```typescript
// features/employees/data-access/employee.adapter.ts

// 1. Raw shape returned by external backend REST API
export interface EmployeeApiDto {
  emp_id: number;
  full_nm: string;
  is_active_flag: 'Y' | 'N';
}

// 2. Clean shape expected by Angular UI components
export interface Employee {
  id: number;
  name: string;
  isActive: boolean;
}

// 3. Pure Adapter function isolating translation logic
export function adaptEmployee(dto: EmployeeApiDto): Employee {
  return {
    id: dto.emp_id,
    name: dto.full_nm.trim(),
    isActive: dto.is_active_flag === 'Y'
  };
}
```

```typescript
// features/employees/data-access/employee.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Employee, EmployeeApiDto, adaptEmployee } from './employee.adapter';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly http = inject(HttpClient);

  getEmployees(): Observable<Employee[]> {
    return this.http.get<EmployeeApiDto[]>('/api/employees').pipe(
      // Converts raw DTO array into clean UI Employee array before components ever see it
      map(rawList => rawList.map(adaptEmployee))
    );
  }
}
```

### Adapter Real-World Enterprise Use Cases
- **Microservice Aggregation**: An Angular frontend aggregating data from 3 legacy microservices (Java, .NET, Python) using Adapters in `data-access/` so every UI component enjoys a consistent TypeScript interface.
- **Third-Party SDK Normalization**: Adapting payloads from payment processors (Stripe, Razorpay, PayPal) into a standard UI checkout receipt model.

---

## 6. The Observer Pattern (Behavioral)

### What is it & Native Angular 22+ Reactivity
The **Observer pattern** allows a single state source (the **Subject**) to automatically broadcast updates to any number of subscribers (**Observers**) the exact instant its value changes—without the subject needing to know who is listening.

In Angular 22+, the Observer pattern is built directly into the framework core:
- **`signal()`**: The reactive **Subject** holding atomic state.
- **`computed()`**: A memoized **Observer** that automatically tracks dependencies and derives new state.
- **`effect()`**: A side-effect **Observer** executing operations whenever monitored signals change.
- **Angular Templates**: Automatic **Template Observers** executing change detection only when bound signals update.
- **RxJS `Observable`**: Asynchronous stream observer for event messaging and WebSockets.

### Observer Architecture Flow Diagram

```
                       ┌─────────────────────────┐
                       │  Subject (State Holder) │
                       │  theme = signal('dark') │
                       └────────────┬────────────┘
                                    │
                                    │ Automatically notifies observers
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
       ┌────────────────────────┐      ┌────────────────────────┐
       │   NavbarComponent      │      │   SidebarComponent     │
       │  (Template Observer)   │      │  (Template Observer)   │
       └────────────────────────┘      └────────────────────────┘
```

### Signals and Effects Walkthrough

```typescript
// core/services/font-size.service.ts
import { Injectable, effect, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FontSizeService {
  // 1. Subject: Holds the reactive state
  readonly fontSizePx = signal<number>(16);

  constructor() {
    // 2. Observer (Side Effect): Automatically runs whenever fontSizePx changes
    effect(() => {
      document.documentElement.style.fontSize = `${this.fontSizePx()}px`;
    });
  }

  increase(): void {
    this.fontSizePx.update(size => size + 2);
  }
}
```

```typescript
// shared/ui/font-controls/font-controls.component.ts
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FontSizeService } from '../../../core/services/font-size.service';

@Component({
  selector: 'app-font-controls',
  standalone: true,
  template: `
    <!-- 3. Template Observer: Automatically re-renders when fontSizePx() updates -->
    <div>
      <span>Current Font Size: {{ fontService.fontSizePx() }}px</span>
      <button type="button" (click)="fontService.increase()">Increase Text</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FontControlsComponent {
  protected readonly fontService = inject(FontSizeService);
}
```

### Observer Real-World Enterprise Use Cases
- **Global Theme & Locale**: Updating user preference signals triggers real-time root CSS variables and translation dictionaries across 50+ components simultaneously.
- **WebSocket Feeds**: Pushing live telemetry, stock tickers, or multi-user collaboration cursors to multiple subscriber components.

---

## 7. Important Edge Cases, Anti-Patterns & Gotchas

### 1. Forgetting `multi: true` on Strategy Tokens
If you register multiple strategies under an `InjectionToken` and omit `multi: true`:
```typescript
// ❌ CRITICAL BUG: Angular silently overwrites earlier registrations!
{ provide: PAYMENT_STRATEGIES, useClass: UpiPaymentStrategy },
{ provide: PAYMENT_STRATEGIES, useClass: CardPaymentStrategy }
// Result: Only CardPaymentStrategy is available. UpiPaymentStrategy is lost!

// ✓ CORRECT:
{ provide: PAYMENT_STRATEGIES, useClass: UpiPaymentStrategy, multi: true },
{ provide: PAYMENT_STRATEGIES, useClass: CardPaymentStrategy, multi: true }
```

### 2. Facade Becoming a "God Object"
A Facade must represent **one cohesive feature domain** (e.g. `CheckoutFacade` or `UserProfileFacade`).
- If a single Facade exceeds 300 lines and combines unrelated domains (e.g. checkout items, user profile, billing history, dark mode toggles), split it into focused facades.

### 3. Over-Engineering Small Features with Strategy
Do not implement a 4-file Strategy pattern for a trivial 2-branch boolean:
```typescript
// ❌ OVER-ENGINEERING:
// Creating 2 strategy classes and an InjectionToken for:
const roleLabel = isAdmin ? 'Full Admin Access' : 'Read Only';

// ✓ RULE OF THUMB:
// Apply Strategy when you have 3 or more algorithm variations or expect new variations to be added regularly.
```

### 4. Adapter Location Hygiene
Keep pure adapter functions located inside `data-access/` alongside HttpClient services:
```
features/employees/
├── data-access/
│   ├── employee.adapter.ts    <-- Pure mapping logic & DTO interfaces
│   └── employee.service.ts    <-- Injects HttpClient, maps with adaptEmployee
└── feature/
    └── employee-list.component.ts <-- Consumes ONLY clean Employee UI model
```

---

## 8. Comprehensive Trade-Off Analysis

| Pattern | Architectural Advantages | Trade-Offs & Disadvantages |
| :--- | :--- | :--- |
| **Facade** | • Clean separation of concerns.<br>• Components stay focused on UI.<br>• Unit tests only need 1 mock facade. | • Indirection overhead: debugging requires stepping through Component &rarr; Facade &rarr; Service.<br>• Risk of becoming a bloated "God Facade". |
| **Strategy** | • Open/Closed Principle compliance.<br>• Zero `if/else` ladders.<br>• Highly testable isolated algorithm units. | • Introduces extra files and boilerplate (interfaces, tokens, strategy classes).<br>• Upfront design effort. |
| **Adapter** | • Shields UI templates from backend schema changes.<br>• Centralizes data normalization and null safety.<br>• Fixes breaking API changes in 1 function. | • Slight runtime conversion cost when transforming large arrays (mitigated by memoization). |
| **Observer** | • Eliminates manual DOM manipulation.<br>• Automatic dependency tracking with Signals.<br>• Glitch-free reactive execution. | • Potential for circular dependencies if `effect()` writes to signals without care. |

---

## 9. Quick Decision Guide: Choosing the Right Pattern

```
                       What is your core architectural challenge?
                                          │
            ┌─────────────────────────────┼─────────────────────────────┐
            ▼                             ▼                             ▼
   "Component injects 6-8         "Giant if/else or           "Backend JSON has ugly
   services to render 1 page"     switch/case for rules"      snake_case / breaks UI"
            │                             │                             │
            ▼                             ▼                             ▼
       USE FACADE                    USE STRATEGY                  USE ADAPTER
```

| If your problem is... | Recommended Pattern |
| :--- | :--- |
| *"My component is injecting 5-7 different services just to render one checkout screen."* | **Facade** |
| *"I have a giant `if / else` block switching between different payment methods, shipping rates, or export formats."* | **Strategy** |
| *"The backend JSON has ugly field names like `usr_nm_01` and `amt_paise`, and renaming them breaks 20 templates."* | **Adapter** |
| *"When this value changes, three different components and local storage need to update automatically."* | **Observer** |

---

## 10. Application Architecture & Interactive Demos

The companion Angular 22+ codebase contains interactive, dark-themed laboratories for each pattern:

```
src/app/
├── core/
│   ├── services/
│   │   └── toast.service.ts          # Signal-based Toast notifications (replaces console.log)
│   └── components/
│       ├── navbar/                   # Sticky dark navigation with active route highlights
│       └── toast/                    # Toast UI viewport with animated cards
├── features/
│   ├── home/                         # Parent overview dashboard & decision guide
│   ├── facade/
│   │   ├── data-access/              # CartItemsService, LoyaltyDiscountService, CheckoutFacade
│   │   └── feature/                  # Interactive Cart & User Dashboard Demos
│   ├── strategy/
│   │   ├── data-access/              # PAYMENT_STRATEGIES token, concrete strategy classes
│   │   ├── strategy.routes.ts        # Route-level multi: true registration
│   │   └── feature/                  # Dynamic payment gateway & shipping fee demos
│   ├── adapter/
│   │   ├── data-access/              # Raw DTOs, pure adaptEmployee & adaptOrder mappers
│   │   └── feature/                  # Live side-by-side Raw JSON vs Clean UI model demo
│   └── observer/
│       ├── data-access/              # FontSizeService, EventBusService
│       └── feature/                  # Multi-subscriber font size & event stream demos
└── styles.css                        # Modern Dark Theme CSS Design System
```

### Running the Application Locally
```bash
# 1. Install dependencies
npm install

# 2. Start development server (serves at http://localhost:4200)
npm start

# 3. Build production bundle (Angular 22+ Vite/esbuild pipeline)
npm run build

# 4. Run automated test suite
npm test
```
