# Production-Grade Micro-Frontends in Angular 22+

A comprehensive architectural blueprint, implementation guide, and interactive reference covering the **3 core micro-frontend (MFE) patterns** in Angular 22+, based on enterprise standards and native web capabilities.

---

## Table of Contents

- [Mandatory Architectural Standard: Strict Angular 22+ Adherence](#mandatory-architectural-standard-strict-angular-22-adherence)
- [Design Philosophy: Dark Theme & Interactive Toast Feedback](#design-philosophy-dark-theme--interactive-toast-feedback)
- [Architecture Comparison Matrix](#architecture-comparison-matrix)
- [Pattern 1: Build-Time Integration (Monorepo Packages)](#pattern-1-build-time-integration-monorepo-packages)
  - [Architecture Flow Diagram](#pattern-1-architecture-flow-diagram)
  - [Directory & Package Structure](#pattern-1-directory--package-structure)
  - [Public API Contract & Lazy Route Integration](#pattern-1-public-api-contract--lazy-route-integration)
  - [How to Run (Windows .bat)](#how-to-run-pattern-1)
- [Pattern 2: Runtime Integration with Native Federation (Production Standard)](#pattern-2-runtime-integration-with-native-federation-production-standard)
  - [Architecture Flow Diagram](#pattern-2-architecture-flow-diagram)
  - [Topology & Ports](#pattern-2-topology--ports)
  - [Native Federation Configuration & Manifest](#native-federation-configuration--manifest)
  - [Cross-MFE Communication Patterns](#cross-mfe-communication-patterns)
  - [Resilience & Offline Remote Fallbacks](#resilience--offline-remote-fallbacks)
  - [How to Run (Multi-Server Windows .bat)](#how-to-run-pattern-2)
- [Pattern 3: Web Components (@angular/elements)](#pattern-3-web-components-angularelements)
  - [Architecture Flow Diagram](#pattern-3-architecture-flow-diagram)
  - [Headless Application & Custom Element Registration](#headless-application--custom-element-registration)
  - [Signal Inputs & Signal Outputs in Custom Elements](#signal-inputs--signal-outputs-in-custom-elements)
  - [Shadow DOM Style Isolation](#shadow-dom-style-isolation)
  - [Legacy HTML Portal Embed](#legacy-html-portal-embed)
  - [How to Run (Multi-Server Windows .bat)](#how-to-run-pattern-3)
- [Summary: Choosing the Right Micro-Frontend Pattern](#summary-choosing-the-right-micro-frontend-pattern)

---

## Mandatory Architectural Standard: Strict Angular 22+ Adherence

> [!IMPORTANT]
> **Strict Framework Policy**: All projects, libraries, and micro-apps in this repository **must strictly adhere to the latest Angular version 22+ (Angular 22.3.0+)**.
>
> 1. **No Legacy NgModules**: All components must be Standalone components (`standalone: true`).
> 2. **Signal-First State**: Use modern Angular 22 Signal APIs (`signal()`, `computed()`, `input()`, `output()`) instead of constructor-based event emitters or untyped observers.
> 3. **Native Control Flow**: All templates must use modern `@if`, `@for (...; track ...)`, and `@switch` syntax. Legacy `*ngIf` and `*ngFor` directives are strictly prohibited.
> 4. **Modern Application Builder**: Use `@angular/build:application` (esbuild + Vite dev server) or `@angular-architects/native-federation` rather than legacy webpack builders.
> 5. **Strict TypeScript 6+ Compatibility**: Strict injection parameters, isolated modules, and strong typing.

---

## Design Philosophy: Dark Theme & Interactive Toast Feedback

- **Component CSS in Dark Theme**: Every host shell and remote component uses a sleek, high-contrast dark theme (`#080d1a`, `#0f172a`, `#1e293b`) with neon indicators, border glows, and scoped selectors to prevent CSS leakage.
- **Interactive UI with Toast Feedback**: Rather than hiding actions in browser `console.log`, every significant user interaction (order creation, status change, route navigation, DOM CustomEvent dispatch, or fallback trigger) fires a rich visual toast alert (`success`, `info`, `warning`, `error`).
- **Learning & Educational Annotations**: The UI features architectural annotations, live code diagrams, and diagnostic cards to explain *what is happening behind the scenes*.

---

## Architecture Comparison Matrix

| Feature / Criteria | Pattern 1: Build-Time Integration | Pattern 2: Runtime Native Federation | Pattern 3: Web Components (@angular/elements) |
| :--- | :--- | :--- | :--- |
| **Integration Mechanism** | TypeScript path mapping & workspace packages | Browser ESM dynamic import via `remoteEntry.json` | W3C Standard Custom Elements (`<support-chat-widget>`) |
| **Deployment Independence** | Low (Single unified deployment) | **High (Each micro-app deploys to its own URL/CDN)** | **Very High (Deployable as standalone script bundle)** |
| **Angular Runtime Sharing** | Shared at compile time | Shared as browser singleton at runtime | Self-contained headless runtime |
| **Cross-Framework Support** | Angular only | Angular (or Module Federation hosts) | **Any framework (React, Vue, AngularJS, Plain HTML)** |
| **Network Complexity** | Zero network calls for remote entries | Manifest & remote entry fetched at runtime | Script tag or dynamic script injection |
| **Best Use Case** | Small-to-medium teams wanting strict code boundaries | Large enterprise teams needing independent releases | Multi-framework ecosystems or legacy portal widgets |

---

## Pattern 1: Build-Time Integration (Monorepo Packages)

### Pattern 1 Architecture Flow Diagram

```
                                    Monorepo Workspace
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       │                                           │
                       ▼                                           ▼
          packages/orders-mfe/                        packages/billing-mfe/
          ├── package.json                            ├── package.json
          └── src/public-api.ts                       └── src/public-api.ts
               (ORDERS_MFE_ROUTES)                         (BILLING_MFE_ROUTES)
                       │                                           │
                       └─────────────────────┬─────────────────────┘
                                             │  Path aliases (@my-org/*)
                                             ▼
                                     host/ (Shell App)
                                     ├── tsconfig.json
                                     └── src/app/app.routes.ts
                                             │
                                             ▼ (ng build / compile time)
                                  Unified Single Bundle
                                 (Host + Lazy Route Chunks)
```

### Pattern 1 Directory & Package Structure

```
1_Build-time_integration_(Monorepo_packages)/
├── host/                              # Host Angular 22 shell
│   ├── src/app/pages/dashboard.ts     # Dark-theme dashboard with interactive concept tests
│   ├── src/app/services/toast.ts      # Signal-based toast notification system
│   ├── src/app/app.routes.ts          # Lazy-loads @my-org/* packages
│   ├── tsconfig.json                  # Path mappings for @my-org/orders-mfe & @my-org/billing-mfe
│   └── angular.json                   # Angular 22 application builder
├── packages/
│   ├── orders-mfe/                    # Orders team domain package
│   │   ├── package.json               # Independent package metadata
│   │   └── src/public-api.ts          # Strict public API exposing ONLY routes & models
│   └── billing-mfe/                   # Financial team domain package
│       ├── package.json               # Independent package metadata
│       └── src/public-api.ts          # Strict public API exposing ONLY routes & models
└── start.bat                          # Automated startup script with error handling
```

### Pattern 1 Public API Contract & Lazy Route Integration

**Orders Package Boundary (`packages/orders-mfe/src/public-api.ts`):**
```typescript
export { ORDERS_MFE_ROUTES } from './lib/orders.routes';
export { OrdersHomeComponent } from './lib/orders-home.component';
export type { Order } from './lib/orders.model';
```

**Host Shell Route (`host/src/app/app.routes.ts`):**
```typescript
export const routes: Routes = [
  {
    path: 'orders',
    loadChildren: () => import('@my-org/orders-mfe').then(m => m.ORDERS_MFE_ROUTES)
  },
  {
    path: 'billing',
    loadChildren: () => import('@my-org/billing-mfe').then(m => m.BILLING_MFE_ROUTES)
  }
];
```

### How to Run Pattern 1

Double-click `1_Build-time_integration_(Monorepo_packages)\start.bat` or run:
```bash
cd "1_Build-time_integration_(Monorepo_packages)"
start.bat
```
*Port:* `http://localhost:4200`

---

## Pattern 2: Runtime Integration with Native Federation (Production Standard)

### Pattern 2 Architecture Flow Diagram

```
                               Browser (http://localhost:4200)
                                              │
                                              ▼
                          ┌───────────────────────────────────────┐
                          │         HOST SHELL (Port 4200)        │
                          │ • Top Navbar & Shared Auth Session    │
                          │ • Reads public/federation.manifest    │
                          └───────┬───────────────────────┬───────┘
                                  │                       │
                   User navigates │        User navigates │
                      to /orders  │           to /billing │
                                  ▼                       ▼
                  ┌────────────────────────┐  ┌────────────────────────┐
                  │  REMOTE 1: Orders MFE  │  │  REMOTE 2: Billing MFE │
                  │ (http://localhost:4201)│  │ (http://localhost:4202)│
                  │ • Exposes ./Routes     │  │ • Exposes ./Routes     │
                  │ • Deploys independently│  │ • Deploys independently│
                  │ • Fallback on failure  │  │ • Fallback on failure  │
                  └────────────────────────┘  └────────────────────────┘
```

### Pattern 2 Topology & Ports

| Application | Role | Port | Dev Server Command | Exposes |
| :--- | :--- | :--- | :--- | :--- |
| `host` | Host Shell Container | **4200** | `npm run start -- --port 4200` | Manifest consumer |
| `orders-mfe` | Remote 1 (Orders Domain) | **4201** | `npm run start -- --port 4201` | `./Routes` |
| `billing-mfe` | Remote 2 (Billing Domain) | **4202** | `npm run start -- --port 4202` | `./Routes` |

### Native Federation Configuration & Manifest

**Host Manifest (`host/public/federation.manifest.json`):**
```json
{
  "orders-mfe": "http://localhost:4201/remoteEntry.json",
  "billing-mfe": "http://localhost:4202/remoteEntry.json"
}
```

**Remote Configuration (`orders-mfe/federation.config.mjs`):**
```javascript
import { withNativeFederation, shareAll } from '@angular-architects/native-federation/config';

export default withNativeFederation({
  name: 'orders-mfe',
  exposes: {
    './Routes': './src/app/orders.routes.ts',
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});
```

### Cross-MFE Communication Patterns

1. **URL & Route Query Parameters (Decoupled & Stateless)**:
   - Navigate to `/orders?customerId=CUST-501&highlight=ORD-901`.
   - The remote reads query params from `ActivatedRoute.queryParams` and highlights specific records without needing shared services.
2. **Shared Auth / Session Singleton**:
   - `AuthService` stores JWT tokens in a shared session store.
   - When the user switches accounts in the Host Shell, all remotes inherit the authenticated user context immediately.
3. **Browser DOM CustomEvent Bus (Pub/Sub)**:
   - Remote dispatches: `window.dispatchEvent(new CustomEvent('cart:updated', { detail: { count: 5 } }))`.
   - Host navbar intercepts the event, updates the live shopping cart badge, and displays a toast notification.

### Resilience & Offline Remote Fallbacks

When a remote micro-frontend server goes down, unhandled network imports cause route transitions to crash. In this project, routes are protected by graceful fallback handlers:

```typescript
{
  path: 'billing',
  loadChildren: () =>
    loadRemoteModule('billing-mfe', './Routes')
      .then(m => m.BILLING_ROUTES)
      .catch(err => {
        console.warn('Billing remote offline, activating circuit breaker fallback:', err);
        return import('./fallbacks/billing-fallback.component').then(m => m.BILLING_FALLBACK_ROUTES);
      })
}
```

### How to Run Pattern 2

Double-click `2_Runtime_integration_with_Native_Federation_(Production_standard)\start_all.bat`.
This orchestrates:
1. Validates Node.js 20+ and project setups.
2. Launches Remote 1 (`orders-mfe`) on Port 4201 in a dedicated window.
3. Launches Remote 2 (`billing-mfe`) on Port 4202 in a dedicated window.
4. Launches Host Shell on Port 4200 and opens the browser.

---

## Pattern 3: Web Components (@angular/elements)

### Pattern 3 Architecture Flow Diagram

```
       Any Host Application (Angular 22 Host, React Portal, or Legacy Plain HTML)
                                         │
        ┌────────────────────────────────┴────────────────────────────────┐
        │                                                                 │
        ▼                                                                 ▼
<support-chat-widget user-id="USR-889">          HTML Attribute: user-id="USR-889"
        │                                                         │
        ├── #shadow-root (open)                                   ▼
        │   ├── 100% Isolated Scoped CSS         Signal Input: userId = input<string>()
        │   └── Standalone UI Components                          │
        │                                                         ▼
        └── Dispatches DOM CustomEvents ───────── Signal Output: chatClosed = output<void>()
            (chatClosed, messageSent)                            messageSent = output<ChatMessage>()
```

### Headless Application & Custom Element Registration

**Web Component Registration (`chat-widget/src/main.ts`):**
```typescript
import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { ChatWidgetComponent } from './app/chat-widget.component';

(async () => {
  // 1. Create a headless Angular injector without a root router
  const app = await createApplication({ providers: [] });

  // 2. Wrap the standalone Angular 22 component as a Custom Element class
  const chatElement = createCustomElement(ChatWidgetComponent, {
    injector: app.injector
  });

  // 3. Register in the browser's CustomElementRegistry
  if (!customElements.get('support-chat-widget')) {
    customElements.define('support-chat-widget', chatElement);
  }
})();
```

### Signal Inputs & Signal Outputs in Custom Elements

```typescript
@Component({
  selector: 'app-chat-widget',
  standalone: true,
  encapsulation: ViewEncapsulation.ShadowDom,
  // ...
})
export class ChatWidgetComponent {
  // HTML attributes (user-id="...") map directly to Signal inputs
  readonly userId = input<string>('Guest');

  // Signal outputs emit native browser CustomEvents to the host DOM
  readonly chatClosed = output<void>();
  readonly messageSent = output<ChatMessage>();
}
```

### Shadow DOM Style Isolation

By configuring `ViewEncapsulation.ShadowDom`, the component's CSS lives entirely within the element's `#shadow-root`. Neither external host stylesheets can tamper with widget styling, nor can widget styles leak out into the host page.

### Legacy HTML Portal Embed

Demonstrated in `3_Web_Components_(@angular_elements)\external-legacy-portal.html`:
```html
<body>
  <h1>Legacy Server-Rendered Enterprise Portal</h1>
  
  <!-- Embedding the Angular 22 micro-app just like a native <video> tag -->
  <support-chat-widget user-id="LEGACY-CUST-409"></support-chat-widget>

  <script type="module" src="http://localhost:4203/main.js"></script>
</body>
```

### How to Run Pattern 3

Double-click `3_Web_Components_(@angular_elements)\start_all.bat`.
This orchestrates:
1. Standalone Chat Widget on Port 4203 (`http://localhost:4203`).
2. Angular 22 Host Portal on Port 4200 (`http://localhost:4200`).
3. Standalone legacy HTML portal available at `external-legacy-portal.html`.

---

## Summary: Choosing the Right Micro-Frontend Pattern

```
                                 Do all teams use Angular?
                                      /            \
                                    YES            NO
                                    /                \
                Need independent deployments?       Web Components (@angular/elements)
                         /            \             • Mixing Angular 22 with React, Vue,
                       YES            NO              or legacy AngularJS / SSR pages
                       /                \
        Runtime Native Federation   Build-time Monorepo Packages
        • Independent release cycle • Strict code boundaries
        • Shared browser singletons • Zero network runtime complexity
        • Resilient fallback routes • Unified single deployment
```
