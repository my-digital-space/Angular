# Production-Grade Angular 22 Project Architecture

## 📋 Table of Contents
1. [Overview & Core Motivation](#1-overview--core-motivation)
2. [Challenges with Flat File-Type Organization](#2-challenges-with-flat-file-type-organization)
3. [Foundational Tier: Feature-Based Organization](#3-foundational-tier-feature-based-organization)
4. [Production Level: Layered Feature Architecture (Smart vs. Dumb)](#4-production-level-layered-feature-architecture-smart-vs-dumb)
5. [The 4 Strict Sub-Layers & Public API](#5-the-4-strict-sub-layers--public-api)
6. [Unidirectional Dependency Flow Diagram](#6-unidirectional-dependency-flow-diagram)
7. [Latest Angular 22 Paradigm Standards](#7-latest-angular-22-paradigm-standards)
8. [Concrete Code Implementation Walkthrough](#8-concrete-code-implementation-walkthrough)
9. [Cross-Feature Communication: Professional Senior Developer Patterns](#9-cross-feature-communication-professional-senior-developer-patterns)
10. [TypeScript Path Aliases & Boundary Enforcement](#10-typescript-path-aliases--boundary-enforcement)
11. [Automated Testing Strategy Across Layers](#11-automated-testing-strategy-across-layers)
12. [Architectural Trade-Off Analysis](#12-architectural-trade-off-analysis)
13. [Real-World Enterprise Use Cases](#13-real-world-enterprise-use-cases)

---

## 1. Overview & Core Motivation

> [!IMPORTANT]
> **Strict Angular 22 Compliance Mandate**:
> All developers, architects, and AI contributors working on this repository **MUST strictly adhere to the latest Angular 22 paradigm standards**. Legacy patterns (such as `NgModule`, `@Input()`, `@Output()`, `EventEmitter`, constructor-based dependency injection, structural directives like `*ngIf`/`*ngFor`, and unmanaged state mutations outside Signals) are **strictly prohibited**. Every feature, component, service, and utility must conform to the Angular 22 standards detailed in [Section 7](#7-latest-angular-22-paradigm-standards).

An enterprise Angular project folder structure is not merely cosmetic; it is the **architectural blueprint** that enforces modular boundaries, prevents tight coupling, enables independent parallel feature development, and guarantees optimal bundle splitting at compile time.

In large enterprise applications with 50+ to 100+ screens, organizing code solely by file type (`components/`, `services/`, `models/`, `pipes/`) inevitably breaks down. A production-grade codebase groups code by **business domain (features)** and isolates responsibility into **technical layers**.

---

## 2. Challenges with Flat File-Type Organization

When applications grow beyond a minimal prototype, flat file-type grouping creates critical systemic bottlenecks:

```
❌ FLAT STRUCTURE (Grouped by File Type - Breaks at Scale)
src/app/
├── components/   <-- 180+ unrelated components dumped in one directory
├── services/     <-- 60+ services injecting and circular-referencing each other
├── models/       <-- 90+ interfaces in one giant flat pool
└── pipes/        <-- Impossible to determine which domain owns which pipe
```

### Real-World Breakdowns:
* **The "Ripple Effect" (Tight Coupling)**: Modifying a method in `user.service.ts` inadvertently breaks checkout or billing screens because features directly import internal implementation details from other domains.
* **Bloated Bundles & Slow Page Loads**: Because everything imports everything across a flat structure, Angular's bundler cannot cleanly code-split. A user visiting a public landing page ends up downloading chunks intended for the Admin Dashboard.
* **Git Merge Conflict Storms**: Multiple engineers working on separate Jira tickets constantly touch the same monolithic folders and configuration files, creating frequent merge conflicts.
* **Circular Dependency Crashes**: `ServiceA` imports `ServiceB`, which imports `ServiceC`, which in turn imports `ServiceA`, triggering runtime errors (`Cannot access 'X' before initialization`).

---

## 3. Foundational Tier: Feature-Based Organization

The baseline shift organizes the application into three core categories:

```
src/app/
├── core/       <-- App-wide singletons (loaded ONCE at startup)
│   ├── auth/   <-- Token interceptor, auth guard, session service
│   ├── state/  <-- App-wide cross-feature reactive stores (e.g. cart-store)
│   ├── events/ <-- Domain event bus for decoupled pub-sub
│   └── layout/ <-- Navigation navbar, sidebar shell
├── shared/     <-- Dumb, reusable pieces shared across 2+ features
│   ├── ui/     <-- Atomic badges, buttons, modals, spinners
│   └── pipes/  <-- Universal formatters (dates, currency)
└── features/   <-- Isolated business domains (Lazy Loaded!)
    ├── products/  <-- Product catalog & inventory
    ├── cart/      <-- Shopping cart & checkout flow
    ├── orders/    <-- Order processing & status
    └── customers/ <-- Customer relationship directory
```

### 🛑 The Golden Rule of Architectural Boundaries:
> **`features/` may import from `shared/` and `core/`.**
> **However, `core/` and `shared/` must NEVER import from `features/`.**

---

## 4. Production Level: Layered Feature Architecture (Smart vs. Dumb)

In large-scale enterprise environments, each business domain inside `features/` is subdivided into **4 strict technical sub-layers** and sealed behind a **single public API (`index.ts`) barrel file**:

```
src/app/
├── core/
│   ├── auth/
│   │   ├── auth.interceptor.ts
│   │   ├── auth.service.ts
│   │   └── auth.guard.ts
│   ├── state/
│   │   ├── cart-store.service.ts       <-- Cross-feature reactive store
│   │   └── cart-store.service.spec.ts
│   ├── events/
│   │   └── domain-event.service.ts     <-- Pub-Sub domain event bus
│   ├── layout/
│   │   └── header.component.ts
│   └── index.ts
│
├── shared/
│   ├── ui/
│   │   └── status-badge.component.ts
│   ├── pipes/
│   │   └── relative-time.pipe.ts
│   └── index.ts
│
└── features/
    ├── products/                       <-- Feature Domain 1: Products
    │   ├── feature/
    │   │   └── product-list-page.component.ts
    │   ├── ui/
    │   │   └── product-card.component.ts
    │   ├── data-access/
    │   │   ├── product.model.ts
    │   │   └── product.service.ts
    │   ├── util/
    │   │   ├── product-discount.util.ts
    │   │   └── product-discount.util.spec.ts
    │   ├── products.routes.ts
    │   └── index.ts
    │
    ├── cart/                           <-- Feature Domain 2: Cart
    │   ├── feature/
    │   │   └── cart-page.component.ts
    │   ├── ui/
    │   │   └── cart-item-row.component.ts
    │   ├── data-access/
    │   │   └── cart-summary.model.ts
    │   ├── cart.routes.ts
    │   └── index.ts
    │
    ├── orders/                         <-- Feature Domain 3: Orders
    │   ├── feature/                    <-- 1. SMART Containers (Pages)
    │   │   └── order-list-page.component.ts
    │   ├── ui/                         <-- 2. DUMB Presentational Components
    │   │   ├── order-card.component.ts
    │   │   └── order-card.component.spec.ts
    │   ├── data-access/                <-- 3. State, API Calls & Models
    │   │   ├── order.model.ts
    │   │   ├── order.service.ts
    │   │   └── order.service.spec.ts
    │   ├── util/                       <-- 4. Pure TypeScript Helpers
    │   │   ├── order-price.util.ts
    │   │   └── order-price.util.spec.ts
    │   ├── orders.routes.ts            <-- Feature Routing
    │   └── index.ts                    <-- Feature Public API (Barrel File)
    │
    └── customers/                      <-- Feature Domain 4: Customers
        ├── feature/
        │   └── customer-list-page.component.ts
        ├── ui/
        │   └── customer-card.component.ts
        ├── data-access/
        │   ├── customer.model.ts
        │   └── customer.service.ts
        ├── util/
        │   └── customer-format.util.ts
        ├── customers.routes.ts
        └── index.ts
```

---

## 5. The 4 Strict Sub-Layers & Public API

| Layer | Responsibility | Allowed Imports | Disallowed Imports |
| :--- | :--- | :--- | :--- |
| **`1. feature/`** (Smart Containers) | Routable pages. Injects services, manages page state, dispatches actions, coordinates dumb components. | `data-access/`, `ui/`, `util/`, `core/`, `shared/` | Direct imports from other features' internal directories |
| **`2. ui/`** (Dumb Components) | Purely visual components. Receives data strictly via `input()` and emits actions via `output()`. | `util/`, `shared/`, domain models from `data-access/` | **NEVER** injects HTTP services or state services. Zero side-effects. |
| **`3. data-access/`** | Manages HTTP calls (`HttpClient`), Signal state (`signal()`, `asReadonly()`), domain models, and interfaces. | Angular core (`HttpClient`, `Injectable`, `signal`), `util/` | **NEVER** imports HTML, UI components, or router elements. |
| **`4. util/`** | Pure mathematical, transformation, and validation functions. | Standard TypeScript standard library | **NEVER** imports from `@angular/*`. Completely framework agnostic. |
| **`5. index.ts`** (Public API) | Feature boundary firewall. Exports only routes and public contracts. | `./*.routes.ts`, `./data-access/*.model.ts` | Never leaks `ui/` components or internal helpers to other features. |

---

## 6. Unidirectional Dependency Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                1. feature/ (Smart Components)                │
│  • Routable container / page components                      │
│  • Injects data-access/ services & coordinates state         │
│  • Passes data DOWN into ui/ via signal input()              │
│  • Listens to events UP from ui/ via signal output()         │
└───────────────────────────────┬──────────────────────────────┘
                │               │
          Uses  ▼         Uses  ▼
┌───────────────────────────┐ ┌────────────────────────────────┐
│ 2. ui/ (Dumb Components)  │ │ 3. data-access/                │
│ • Purely visual           │ │ • HTTP requests & API calls    │
│ • NO service injections!  │ │ • Signal state management      │
│ • Only input() & output() │ │ • Interfaces & domain models   │
│ • ChangeDetection.OnPush  │ │ • Zero HTML / CSS awareness    │
└───────────────┬───────────┘ └────────────────┬───────────────┘
                │                              │
                └───────────────┬──────────────┘
                          Uses  ▼
┌──────────────────────────────────────────────────────────────┐
│                 4. util/ (Pure Functions)                    │
│  • Pure TypeScript calculation & formatting helpers          │
│  • Zero Angular framework dependencies                       │
│  • Blazing-fast unit tests without TestBed overhead          │
└──────────────────────────────────────────────────────────────┘
```

---

## 7. Latest Angular 22 Paradigm Standards

> [!CAUTION]
> **Mandatory Code Quality Rule**:
> Every pull request, schematic, and module in this project **must strictly adhere to Angular 22 paradigms**. Submissions containing legacy Angular patterns will be rejected during automated CI code review.

### Mandatory Standards vs. Strictly Prohibited Legacy Patterns

| Architectural Feature | ✅ Required Angular 22 Standard | ❌ Strictly Prohibited Legacy Anti-Pattern |
| :--- | :--- | :--- |
| **Component Architecture** | Standalone default (omit redundant `standalone: true`) | `NgModule`, `@NgModule({ declarations: [...] })` |
| **Component Dependencies** | Explicit direct `imports: [ComponentA, PipeB]` | Shared monolithic `SharedModule` imports |
| **Component Inputs** | `readonly myInput = input.required<T>()` / `input<T>()` | `@Input() myInput!: T;` |
| **Component Outputs** | `readonly myAction = output<T>()` | `@Output() myAction = new EventEmitter<T>();` |
| **Derived State** | `readonly total = computed(() => ...)` | Imperative lifecycle updates (`ngOnChanges`) |
| **State Mutation** | `mySignal.update(curr => ...)` / `set(...)` | Direct mutation of mutable objects/arrays |
| **Template Control Flow** | `@if (...)`, `@for (...; track id)`, `@empty` | `*ngIf`, `*ngFor`, `*ngSwitch` directives |
| **Dependency Injection** | Functional `private readonly svc = inject(MyService);` | Constructor injection `constructor(private svc: MyService) {}` |
| **HTTP Interceptors** | Functional `export const myInterceptor: HttpInterceptorFn` | Class-based `implements HttpInterceptor` |
| **Route Guards** | Functional `export const myGuard: CanActivateFn` | Class-based `implements CanActivate` |
| **Router Input Binding** | `withComponentInputBinding()` + `input<string>()` | Injecting `ActivatedRoute` and manual `.paramMap.subscribe()` |
| **Change Detection** | `changeDetection: ChangeDetectionStrategy.OnPush` | Default change detection strategy |

---

## 8. Concrete Code Implementation Walkthrough

### Step A: The Domain Model & Signal Service (`data-access/`)

```typescript
// src/app/features/orders/data-access/order.model.ts
export type OrderStatus = 'PENDING' | 'SHIPPED' | 'DELIVERED';

export interface Order {
  id: string;
  customerName: string;
  subtotal: number;
  taxRate: number;
  status: OrderStatus;
}
```

```typescript
// src/app/features/orders/data-access/order.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from './order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/v1/orders';

  private readonly ordersState = signal<Order[]>([
    { id: 'ORD-101', customerName: 'Ananya Sharma', subtotal: 2500, taxRate: 0.18, status: 'PENDING' },
    { id: 'ORD-102', customerName: 'Rohan Das', subtotal: 4200, taxRate: 0.18, status: 'SHIPPED' },
    { id: 'ORD-103', customerName: 'Priya Patel', subtotal: 6800, taxRate: 0.18, status: 'DELIVERED' }
  ]);

  readonly orders = this.ordersState.asReadonly();

  markAsDelivered(orderId: string): void {
    this.ordersState.update((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId ? { ...order, status: 'DELIVERED' } : order
      )
    );
  }
}
```

### Step B: Pure Business Helper (`util/`)

```typescript
// src/app/features/orders/util/order-price.util.ts
export function calculateFinalOrderTotal(subtotal: number, taxRate: number): number {
  const taxAmount = subtotal * taxRate;
  return Math.round((subtotal + taxAmount) * 100) / 100;
}
```

### Step C: Dumb Presentational Component (`ui/`)

```typescript
// src/app/features/orders/ui/order-card.component.ts
import { Component, ChangeDetectionStrategy, computed, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Order } from '../data-access/order.model';
import { calculateFinalOrderTotal } from '../util/order-price.util';
import { StatusBadgeComponent, BadgeVariant } from '@app/shared';

@Component({
  selector: 'app-order-card',
  imports: [CurrencyPipe, StatusBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="order-card">
      <div class="card-header">
        <div>
          <span class="order-id">{{ order().id }}</span>
          <h3 class="customer-name">{{ order().customerName }}</h3>
        </div>
        <app-status-badge [label]="order().status" [variant]="statusVariant()" />
      </div>

      <div class="card-body">
        <div class="metric-row">
          <span>Subtotal:</span>
          <span>{{ order().subtotal | currency:'INR':'symbol':'1.2-2' }}</span>
        </div>
        <div class="metric-row">
          <span>Tax Rate:</span>
          <span>{{ order().taxRate * 100 }}%</span>
        </div>
        <div class="metric-row total-row">
          <strong>Total (incl. tax):</strong>
          <strong>{{ totalAmount() | currency:'INR':'symbol':'1.2-2' }}</strong>
        </div>
      </div>

      <div class="card-actions">
        @if (order().status !== 'DELIVERED') {
          <button type="button" class="btn-action" (click)="onCompleteClick()">
            Mark as Delivered
          </button>
        } @else {
          <span class="completed-tag">✓ Completed</span>
        }
      </div>
    </div>
  `
})
export class OrderCardComponent {
  readonly order = input.required<Order>();
  readonly markDelivered = output<string>();

  readonly totalAmount = computed(() =>
    calculateFinalOrderTotal(this.order().subtotal, this.order().taxRate)
  );

  protected readonly statusVariant = computed<BadgeVariant>(() => {
    switch (this.order().status) {
      case 'DELIVERED': return 'success';
      case 'SHIPPED': return 'info';
      case 'PENDING': return 'warning';
      default: return 'neutral';
    }
  });

  onCompleteClick(): void {
    this.markDelivered.emit(this.order().id);
  }
}
```

### Step D: Smart Container Component (`feature/`)

```typescript
// src/app/features/orders/feature/order-list-page.component.ts
import { Component, ChangeDetectionStrategy, inject, input, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderService } from '../data-access/order.service';
import { OrderCardComponent } from '../ui/order-card.component';

@Component({
  selector: 'app-order-list-page',
  imports: [OrderCardComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="orders-page">
      <header class="page-header">
        <h2>Customer Orders</h2>
        @if (customerName()) {
          <div class="active-filter-banner">
            <span>Filtered by customer: <strong>{{ customerName() }}</strong></span>
            <a routerLink="/orders">✕ Clear Filter</a>
          </div>
        }
      </header>

      <div class="orders-list">
        @for (item of filteredOrders(); track item.id) {
          <app-order-card
            [order]="item"
            (markDelivered)="handleMarkDelivered($event)"
          />
        } @empty {
          <div class="empty-state">No orders found.</div>
        }
      </div>
    </section>
  `
})
export class OrderListPageComponent {
  // Bound automatically from ?customerName= query parameter
  readonly customerName = input<string>();

  protected readonly orderService = inject(OrderService);

  protected readonly filteredOrders = computed(() => {
    const filter = this.customerName();
    const orders = this.orderService.orders();
    if (!filter) return orders;
    return orders.filter((o) =>
      o.customerName.toLowerCase().includes(filter.toLowerCase())
    );
  });

  handleMarkDelivered(orderId: string): void {
    this.orderService.markAsDelivered(orderId);
  }
}
```

---

## 9. Cross-Feature Communication: Professional Senior Developer Patterns

A frequent architectural anti-pattern in growing applications is **direct coupling between features**:

```typescript
// ❌ CRITICAL ANTI-PATTERN: Direct Deep Import Across Features
// src/app/features/cart/data-access/cart.service.ts
import { OrderService } from '../../orders/data-access/order.service'; // NEVER DO THIS!
```

### Why Direct Cross-Feature Imports Break Production:
1. **Destroys Code Splitting**: Bundlers bundle both features together, destroying lazy loading.
2. **Circular Dependencies**: When Feature A imports Feature B and Feature B later needs Feature A, Angular runtime crashes with `Cannot access 'X' before initialization`.
3. **Merge Conflict Storms**: Multiple squads working on separate Jira epics constantly break each other's code.

---

### 🏆 The 4 Enterprise Cross-Feature Communication Patterns

```
                                  ┌────────────────────────────────────────┐
                                  │      Pattern 1: Router Navigation      │
                                  │   (URL params, Query params, State)    │
                                  └───────────────────▲────────────────────┘
                                                      │
                       ┌──────────────────────────────┴──────────────────────────────┐
                       │                                                             │
        ┌──────────────┴──────────────┐                               ┌──────────────▼──────────────┐
        │     features/customers      │                               │       features/orders       │
        │ • Customer directory        │                               │ • Order list & management   │
        └──────────────┬──────────────┘                               └──────────────▲──────────────┘
                       │                                                             │
                       │ Pattern 3: Pub-Sub Events                Pattern 2: State   │
                       │ (e.g. CUSTOMER_SELECTED)                 (Reads active cart)│
                       ▼                                                             ▼
┌─────────────────────────────────────────────┐             ┌─────────────────────────────────────────────┐
│    core/events/domain-event.service.ts      │             │      core/state/cart-store.service.ts       │
│  • Decoupled event bus for pub/sub events   │             │  • App-level reactive state via Signals     │
│  • Features listen without coupling         │             │  • Shared between products, cart, & shell   │
└─────────────────────────────────────────────┘             └─────────────────────────────────────────────┘
                       ▲                                                             ▲
                       │ Pattern 3: Pub-Sub Events                Pattern 2: State   │
                       │ (e.g. PRODUCT_ADDED)                     (Mutates cart)     │
                       │                                                             │
        ┌──────────────┴──────────────┐                               ┌──────────────┴──────────────┐
        │      features/products      │                               │        features/cart        │
        │ • Catalog & inventory       │                               │ • Cart items & summary      │
        └─────────────────────────────┘                               └─────────────────────────────┘
```

---

### Pattern 1: Router Parameters & Input Binding (Navigational Flow)
* **When to use**: Transitioning the user from one feature to another (e.g., clicking *"View Orders"* inside `features/customers` to see orders for that customer in `features/orders`).
* **Senior Implementation**:
  1. `features/customers/ui/customer-card.component.ts` navigates with query parameters:
     ```html
     <a [routerLink]="['/orders']" [queryParams]="{ customerName: customer().name }">
       View Orders →
     </a>
     ```
  2. In `app.config.ts`, `withComponentInputBinding()` is enabled:
     ```typescript
     provideRouter(routes, withComponentInputBinding())
     ```
  3. `features/orders/feature/order-list-page.component.ts` declares a signal input:
     ```typescript
     readonly customerName = input<string>(); // Populated automatically from URL!
     ```
* **Decoupling Score**: **100%**. Neither feature imports anything from the other.

---

### Pattern 2: Shared Domain Store in `core/state/` (Cross-Cutting Reactive State)
* **When to use**: Multiple features need to read or modify the same reactive business state (e.g. `features/products` adds items, `features/cart` displays them, and `core/layout/header.component` displays the real-time cart badge).
* **Senior Implementation**:
  State is elevated into `src/app/core/state/cart-store.service.ts`:
  ```typescript
  @Injectable({ providedIn: 'root' })
  export class CartStoreService {
    private readonly itemsState = signal<CartItem[]>([]);
    readonly items = this.itemsState.asReadonly();
    readonly totalItemCount = computed(() =>
      this.itemsState().reduce((sum, item) => sum + item.quantity, 0)
    );

    addToCart(product: CartProduct): void {
      this.itemsState.update(current => [...current, { product, quantity: 1 }]);
    }
  }
  ```
  Both `features/products` and `features/cart` inject `CartStoreService` via `@app/core`.
* **Decoupling Score**: **High**. Neither feature imports from the other; both depend on the shared core contract.

---

### Pattern 3: Decoupled Domain Event Bus (Pub-Sub Architecture)
* **When to use**: Asynchronous notifications where the sender does not need to know who is listening (e.g., Audit logs, Analytics, Toast notifications).
* **Senior Implementation**:
  Located in `src/app/core/events/domain-event.service.ts`:
  ```typescript
  export type DomainEventType = 'PRODUCT_ADDED_TO_CART' | 'ORDER_PLACED';

  @Injectable({ providedIn: 'root' })
  export class DomainEventBusService {
    private readonly latestEventState = signal<DomainEvent | null>(null);
    readonly latestEvent = this.latestEventState.asReadonly();

    dispatch<T>(type: DomainEventType, payload: T): void {
      this.latestEventState.set({ type, payload, timestamp: Date.now() });
    }
  }
  ```
  `features/products` calls `eventBus.dispatch('PRODUCT_ADDED_TO_CART', product)`. An analytics or notification listener reacts without direct coupling.

---

### Pattern 4: Feature Public API (`index.ts`) Contract Consumption
* **When to use**: Feature A needs data types or contracts created by Feature B.
* **Senior Implementation**:
  Feature A only imports from the public barrel:
  ```typescript
  // Allowed: Importing public contracts from barrel
  import type { Order, OrderStatus } from '@app/features/orders';
  ```
  Never deep-import internals:
  ```typescript
  // ❌ Strictly forbidden: Deep import of internal feature implementation
  import { OrderCardComponent } from '@app/features/orders/ui/order-card.component';
  ```

---

### 📊 Cross-Feature Communication Decision Matrix

| Mechanism | Direction | Latency / Frequency | Typical Use Case | Coupling Level |
| :--- | :--- | :--- | :--- | :--- |
| **Router Input Binding** | Navigational (A → B) | User-initiated page transition | Customer profile → Customer orders | Zero Coupling |
| **Core Shared Signal Store** | Bidirectional (A ↔ B) | Continuous real-time reactivity | Product Catalog ↔ Cart ↔ Navigation Badge | High Cohesion, Clean Abstraction |
| **Domain Event Bus** | Fire-and-forget (A → Many) | Asynchronous triggers | Product Added → Analytics & Notifications | Zero Coupling |
| **Barrel Public API (`index.ts`)** | Static Contracts | Compile-time typing | Reusing domain interfaces across libraries | Contractual Coupling Only |

---

## 10. TypeScript Path Aliases & Boundary Enforcement

Configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@app/core": ["./src/app/core/index.ts"],
      "@app/core/*": ["./src/app/core/*"],
      "@app/shared": ["./src/app/shared/index.ts"],
      "@app/shared/*": ["./src/app/shared/*"],
      "@app/features/*": ["./src/app/features/*"]
    }
  }
}
```

### Automated Lint Rule Enforcement:
In production pipelines using `eslint-plugin-boundaries` or `@nx/enforce-module-boundaries`, lint errors fail pull requests if:
1. A file in `src/app/features/orders/ui/` attempts to import from `../data-access/order.service.ts`.
2. A file in `src/app/features/customers/` attempts to deep-import `src/app/features/orders/ui/order-card.component.ts`.
3. A file in `src/app/shared/` or `src/app/core/` attempts to import anything from `src/app/features/`.

---

## 11. Automated Testing Strategy Across Layers

Because each layer has a distinct concern, testing is clean and fast:

```
┌─────────────────┬────────────────────────────┬──────────────────────────────────────┐
│ Layer           │ Test File                  │ Strategy                             │
├─────────────────┼────────────────────────────┼──────────────────────────────────────┤
│ util/           │ order-price.util.spec.ts   │ Pure Vitest (zero TestBed overhead)   │
│ util/           │ product-discount.util.spec │ Pure Vitest pure math calculation    │
│ ui/             │ order-card.component.spec  │ Isolated component fixture (inputs)  │
│ data-access/    │ order.service.spec.ts      │ Service tests inspecting signals     │
│ core/state/     │ cart-store.service.spec.ts │ Cross-feature signal store tests     │
│ root shell      │ app.spec.ts                │ Application container smoke test     │
└─────────────────┴────────────────────────────┴──────────────────────────────────────┘
```

All 15 tests in this project execute and pass in under 4 seconds.

---

## 12. Architectural Trade-Off Analysis

| Advantages | Considerations & Mitigation |
| :--- | :--- |
| **High Parallel Team Scaling**: Squads work independently in their respective domain folders (`products`, `cart`, `orders`, `customers`) with near-zero Git merge collisions. | **Initial Boilerplate**: Creating 4 sub-layers (`feature/`, `ui/`, `data-access/`, `util/`) is heavyweight for trivial 1-page apps. *Mitigation: Standardize CLI schematics.* |
| **Automatic Code Splitting**: Routes are loaded on demand via `loadChildren`, keeping initial page load under 75 kB compressed. | **Linting Discipline**: Requires automated boundary linting so developers don't bypass `index.ts`. |
| **Effortless Unit Testing**: Presentational components and pure utilities require zero complex HTTP mocks. | **"Premature Shared" Trap**: Keep components local to the feature until a second domain proves it needs reuse. |

---

## 13. Real-World Enterprise Use Cases

* **E-Commerce Platforms (e.g. Amazon / Flipkart)**:
  * `features/products/`: Faceted search, catalog grid, pricing calculation.
  * `core/state/cart-store`: Centralized cart count and pricing signal store.
  * `features/cart/`: Cart review, item quantity changes, checkout initiation.
  * `features/orders/`: Order status tracking and history.
* **FinTech & Banking Portals**:
  * `core/auth/`: Bearer token refresh, biometrics, inactivity session watchdog.
  * `features/accounts/`, `features/transfers/`, `features/loans/`: Each feature has an isolated `data-access/` store, ensuring account data never leaks into loans state.
* **Multi-App Monorepos (Nx / Turborepo)**:
  * Both a Customer Portal and an Internal Back-office Dashboard consume the shared `@app/core` state and `@app/features/*/index.ts` contracts without duplicating validation logic or HTTP adapters.
