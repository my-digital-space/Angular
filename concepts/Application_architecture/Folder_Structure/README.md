# Production-Grade Angular 22 Project Architecture

> [!IMPORTANT]
> **Strict Angular 22 Compliance Mandate**:
> All components, services, routes, and utilities in this project **MUST strictly adhere to Angular 22 standards**. The use of legacy constructs (`NgModule`, `@Input()`, `@Output()`, `EventEmitter`, constructor injection, `*ngIf`/`*ngFor`, and untyped state mutations) is strictly prohibited. Refer to [GEMINI.md](file:///d:/MyCode/My_GitHub/my-digital-space/Angular/concepts/Application_architecture/Folder_Structure/GEMINI.md) for the complete architectural specification and compliance rules.

This project demonstrates a production-grade folder structure for large-scale enterprise applications built with **Angular 22** (Standalone Components, Signals, modern reactive control flow, and strict architectural boundaries).

---

## 🏆 Production Level: Layered Feature Architecture (Smart vs. Dumb)

In large enterprise Angular applications, grouping code purely by file type (`components/`, `services/`, `models/`) fails at scale, leading to tight coupling ("ripple effect"), bundle bloat, and Git merge conflicts.

Instead, production applications organize code by **business domain** (`features/`), with each domain isolated into **4 strict sub-layers** exposed through a single public entry point (`index.ts` barrel file).

```
src/app/
├── core/                               <-- App-wide singletons (loaded ONCE at root)
│   ├── auth/
│   │   ├── auth.interceptor.ts         <-- Functional HTTP interceptor (Bearer token)
│   │   ├── auth.service.ts             <-- Singleton auth & user state
│   │   └── auth.guard.ts               <-- Functional route guard
│   ├── state/
│   │   ├── cart-store.service.ts       <-- Centralized cross-feature Signal store
│   │   └── cart-store.service.spec.ts
│   ├── events/
│   │   └── domain-event.service.ts     <-- Pub-Sub domain event bus
│   ├── layout/
│   │   └── header.component.ts         <-- App shell navigation header
│   └── index.ts                        <-- Core public API
│
├── shared/                             <-- Reusable dumb pieces shared by 2+ features
│   ├── ui/
│   │   └── status-badge.component.ts   <-- Reusable presentational badge
│   ├── pipes/
│   │   └── relative-time.pipe.ts       <-- Timestamp formatter
│   └── index.ts                        <-- Shared public API
│
└── features/                           <-- Isolated business domains (Lazy-loaded)
    ├── products/                       <-- Feature 1: Products Catalog
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
    ├── cart/                           <-- Feature 2: Shopping Cart
    │   ├── feature/
    │   │   └── cart-page.component.ts
    │   ├── ui/
    │   │   └── cart-item-row.component.ts
    │   ├── data-access/
    │   │   └── cart-summary.model.ts
    │   ├── cart.routes.ts
    │   └── index.ts
    │
    ├── orders/                         <-- Feature 3: Orders Domain
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
    └── customers/                      <-- Feature 4: Customers Domain
        ├── feature/                    <-- 1. SMART Containers
        │   └── customer-list-page.component.ts
        ├── ui/                         <-- 2. DUMB Presentational Components
        │   └── customer-card.component.ts
        ├── data-access/                <-- 3. State, API Calls & Models
        │   ├── customer.model.ts
        │   └── customer.service.ts
        ├── util/                       <-- 4. Pure TypeScript Helpers
        │   └── customer-format.util.ts
        ├── customers.routes.ts         <-- Feature Routing
        └── index.ts                    <-- Feature Public API (Barrel File)
```

---

## 🔄 Cross-Feature Data Flow: 4 Professional Patterns

How senior developers communicate across feature domains without creating tight coupling:

1. **Router Navigation & Input Binding (`withComponentInputBinding()`)**:
   - For navigational flows (e.g., clicking *"View Orders"* inside `features/customers` navigates to `/orders?customerName=Ananya`).
   - `OrderListPageComponent` receives `readonly customerName = input<string>()` automatically from the URL query parameter.
   - **Coupling: 0%**.
2. **Centralized Signal Store (`core/state/cart-store.service.ts`)**:
   - For continuous reactive state shared across independent features (`products` adds items, `cart` displays items, `header` displays count badge).
   - Features inject the shared store from `@app/core`. Neither feature imports the other.
3. **Decoupled Domain Event Bus (`core/events/domain-event.service.ts`)**:
   - For fire-and-forget notifications (`PRODUCT_ADDED_TO_CART`, `ORDER_PLACED`) handled by analytics or notifications without direct dependencies.
4. **Public API Barrel Contracts (`index.ts`)**:
   - When a feature needs domain types, it only imports from the public `@app/features/orders` barrel, never from internal paths.

---

## 🚀 Running the Project

```bash
# Build the application
npm run build

# Run unit tests
npm test -- --watch=false

# Start local development server
npm start
```
