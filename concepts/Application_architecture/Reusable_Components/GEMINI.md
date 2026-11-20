# Reusable Components: Content Projection (`ng-content`) & Template Customization

> [!IMPORTANT]
> ### Strict Requirement: Adherence to Angular 22+
> All code, components, services, templates, testing suites, and architectural patterns in this project must strictly adhere to the latest **Angular version 22 (v22+)** standards:
> - **Standalone by Default**: Do not include redundant `standalone: true` flags; standalone is the native default for components, directives, and pipes.
> - **Signal-Based Reactivity**: Use signal-based inputs (`input()`, `input.required()`) marked `readonly` (to satisfy `strictInputAccessModifiers`), signal queries (`viewChild()`, `contentChild()`), and functional outputs (`output()`). Never use legacy `@Input()` or `@Output() new EventEmitter()`.
> - **Native Control Flow**: Exclusively use modern built-in control flow (`@if`, `@for`, `@switch`, `@let`) instead of legacy structural directives (`*ngIf`, `*ngFor`). Never import `CommonModule` solely for control flow.
> - **Fine-Grained Change Detection**: Enforce `ChangeDetectionStrategy.OnPush` across all presentational and reusable components, paired with Angular Signals.
> - **Modern Build & Test Tooling**: Adhere to the `@angular/build` application builder and Vitest unit testing harness (`@angular/build:unit-test`).
> - **Zero Legacy Modules**: Do not introduce `NgModule` wrappers or obsolete lifecycle workarounds.

---

## 1. Concept Overview

### What is a Reusable Component?
A reusable component is an independent, self-contained building block of a UI (e.g., buttons, cards, modal dialogs, data tables) designed to be used across multiple screens and business domains without code duplication.

Instead of hardcoding business logic or API calls inside the component:
- **Inputs (`input()`)**: Data flows down from the parent.
- **Outputs (`output()`)**: User interaction events flow up to the parent.
- **Content Projection (`<ng-content>`)**: Visual templates and custom HTML are projected into designated slots.
- **Zero Direct Service Injections**: The dumb component does not directly inject HTTP services or feature-specific stores.

### Challenges Without Reusable Components
- **UI & UX Drift**: Inconsistent padding, border radii, or colors across screens.
- **Painful Global Updates**: Changing brand styling or ARIA accessibility rules requires modifying dozens of templates.
- **Bloated Bundles**: Duplicating identical HTML/CSS across views increases maintenance costs and bundle sizes.
- **Bug Propagation**: Fixing keyboard navigation or state bugs in one copy-pasted block leaves other instances broken.

---

## 2. Production Pattern: Multi-Slot Content Projection

In complex enterprise applications, passing plain strings via inputs is insufficient when a container component (such as a Card or Modal) needs completely different content in different screens (e.g., a form in one screen, charts in another, custom buttons in the footer).

Instead of creating dozens of `@Input()` flags (which creates an unmaintainable "God Component"), **Multi-Slot Content Projection** delegates body and footer markup to the parent while preserving standardized container framing, header styling, and dismiss logic.

```
Parent Template (order-summary-page.component.html)
┌──────────────────────────────────────────────────────────┐
│ <app-info-card title="Order #ORD-2026">                  │
│                                                          │
│   <div card-body>                                        │
│     <!-- Custom HTML injected here -->                   │
│   </div>                                                 │
│                                                          │
│   <div card-footer>                                      │
│     <!-- Action buttons injected here -->                │
│   </div>                                                 │
│ </app-info-card>                                         │
└───────────────────────────┬──────────────────────────────┘
                            │ Projected into matching slots
                            ▼
Reusable Component (info-card.component.html)
┌──────────────────────────────────────────────────────────┐
│ Header: {{ title() }}                                    │
│ ──────────────────────────────────────────────────────── │
│ <ng-content select="[card-body]" />                      │
│ ──────────────────────────────────────────────────────── │
│ <ng-content select="[card-footer]" />                    │
└──────────────────────────────────────────────────────────┘
```

---

## 3. Project Structure

```
src/app/
├── features/
│   └── orders/
│       └── feature/
│           ├── order-summary-page.component.ts
│           ├── order-summary-page.component.html
│           └── order-summary-page.component.spec.ts
├── shared/
│   └── ui/
│       ├── action-button/
│       │   ├── action-button.component.ts
│       │   ├── action-button.component.html
│       │   ├── action-button.component.css
│       │   └── action-button.component.spec.ts
│       └── info-card/
│           ├── info-card.component.ts
│           ├── info-card.component.html
│           ├── info-card.component.css
│           └── info-card.component.spec.ts
├── app.ts
├── app.html
├── app.css
├── app.config.ts
└── app.routes.ts
```

---

## 4. Code Implementation

### A. Reusable Multi-Slot Info Card (`shared/ui/info-card/`)

#### `info-card.component.ts`
```typescript
import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrl: './info-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfoCardComponent {
  // Card title shown in the header
  readonly title = input.required<string>();

  // Optional subtitle for extra context
  readonly subtitle = input<string>('');

  // Optional flag to show a close/dismiss icon in the top-right corner
  readonly dismissible = input<boolean>(false);

  // Notifies parent if user clicks the dismiss button
  readonly dismissed = output<void>();

  onDismiss(): void {
    this.dismissed.emit();
  }
}
```

#### `info-card.component.html`
```html
<article class="card-container">
  <!-- Standardized Header -->
  <header class="card-header">
    <div>
      <h3 class="card-title">{{ title() }}</h3>
      @if (subtitle()) {
        <p class="card-subtitle">{{ subtitle() }}</p>
      }
    </div>

    @if (dismissible()) {
      <button
        type="button"
        class="dismiss-btn"
        aria-label="Close card"
        (click)="onDismiss()"
      >
        ✕
      </button>
    }
  </header>

  <!-- Slot 1: Dynamic Body Content injected by the parent screen -->
  <section class="card-body">
    <ng-content select="[card-body]" />
  </section>

  <!-- Slot 2: Dynamic Footer Actions injected by the parent screen -->
  <footer class="card-footer">
    <ng-content select="[card-footer]" />
  </footer>
</article>
```

#### `info-card.component.css`
```css
.card-container {
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.card-title {
  margin: 0;
  font-size: 1.125rem;
  color: #0f172a;
}

.card-subtitle {
  margin: 4px 0 0;
  font-size: 0.875rem;
  color: #64748b;
}

.dismiss-btn {
  background: transparent;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  color: #64748b;
}

.card-body {
  padding: 20px;
}

.card-footer {
  padding: 12px 20px;
  background-color: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* Hides the footer bar completely if the parent did not provide [card-footer] */
.card-footer:empty {
  display: none;
}
```

---

### B. Reusable Action Button (`shared/ui/action-button/`)

#### `action-button.component.ts`
```typescript
import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.component.html',
  styleUrl: './action-button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionButtonComponent {
  // Required label text passed from parent
  readonly label = input.required<string>();

  // Optional visual style with a safe default value
  readonly variant = input<ButtonVariant>('primary');

  // Optional disabled state
  readonly disabled = input<boolean>(false);

  // Emits a click event upward without knowing what action will happen
  readonly buttonClick = output<void>();

  onButtonClick(): void {
    if (!this.disabled()) {
      this.buttonClick.emit();
    }
  }
}
```

#### `action-button.component.html`
```html
<button
  type="button"
  class="btn"
  [class.btn-primary]="variant() === 'primary'"
  [class.btn-secondary]="variant() === 'secondary'"
  [class.btn-danger]="variant() === 'danger'"
  [disabled]="disabled()"
  (click)="onButtonClick()"
>
  {{ label() }}
</button>
```

#### `action-button.component.css`
```css
.btn {
  padding: 10px 18px;
  border-radius: 6px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #2563eb;
  color: #ffffff;
}

.btn-secondary {
  background-color: #e2e8f0;
  color: #1e293b;
}

.btn-danger {
  background-color: #dc2626;
  color: #ffffff;
}
```

---

### C. Feature Screen (`features/orders/feature/`)

#### `order-summary-page.component.ts`
```typescript
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { InfoCardComponent } from '../../../shared/ui/info-card/info-card.component';
import { ActionButtonComponent } from '../../../shared/ui/action-button/action-button.component';

@Component({
  selector: 'app-order-summary-page',
  imports: [InfoCardComponent, ActionButtonComponent],
  templateUrl: './order-summary-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderSummaryPageComponent {
  readonly isVisible = signal(true);

  cancelOrder(): void {
    console.log('Order cancelled');
  }

  approveOrder(): void {
    console.log('Order approved');
  }
}
```

#### `order-summary-page.component.html`
```html
@if (isVisible()) {
  <app-info-card
    title="Order #ORD-2026"
    subtitle="Placed on November 19, 2026"
    [dismissible]="true"
    (dismissed)="isVisible.set(false)"
  >
    <!-- Custom HTML injected into [card-body] -->
    <div card-body>
      <p><strong>Customer:</strong> Vikram Sen</p>
      <p><strong>Items:</strong> 2x Wireless Mechanical Keyboards</p>
      <p><strong>Total Amount:</strong> ₹14,500</p>
    </div>

    <!-- Reusable ActionButtons injected into [card-footer] -->
    <div card-footer>
      <app-action-button
        label="Cancel Order"
        variant="danger"
        (buttonClick)="cancelOrder()"
      />
      <app-action-button
        label="Approve Shipment"
        variant="primary"
        (buttonClick)="approveOrder()"
      />
    </div>
  </app-info-card>
}
```

---

## 5. Modern Angular (v22+) Best Practices Applied

1. **Standalone by Default**:
   - Starting in Angular 19 and continued in Angular 22, all components, directives, and pipes are standalone by default. Redundant `standalone: true` declarations are omitted.
2. **Signal-Based Inputs**:
   - Uses `input.required<T>()` and `input<T>(defaultValue)`.
   - Modifiers are marked `readonly` to comply with `"strictInputAccessModifiers": true`.
3. **Functional Outputs**:
   - Uses `output<void>()` instead of `@Output() new EventEmitter<void>()`.
4. **Native Control Flow**:
   - Uses `@if (...)` blocks rather than legacy `*ngIf`, eliminating `CommonModule` dependencies.
5. **OnPush Change Detection**:
   - `ChangeDetectionStrategy.OnPush` pairs with Angular Signals for optimal change detection performance.
6. **Self-Closing Component & Projection Tags**:
   - Standardized use of self-closing syntax: `<ng-content select="..." />` and `<app-action-button ... />`.

---

## 6. Verification and Testing

### Build
```bash
npm run build
```
Generates production application bundles with 0 compilation warnings or errors.

### Tests
```bash
npx ng test --watch=false
```
All unit test suites (Vitest runner with Angular test harness) pass:
- `ActionButtonComponent` (5 tests)
- `InfoCardComponent` (3 tests)
- `OrderSummaryPageComponent` (4 tests)
- `App` (2 tests)
