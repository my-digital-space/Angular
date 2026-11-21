import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface PatternCard {
  id: string;
  name: string;
  category: 'Structural' | 'Behavioral';
  route: string;
  badge: string;
  tagline: string;
  problem: string;
  solution: string;
  implementationHint: string;
  highlights: string[];
}

export interface DecisionScenario {
  problem: string;
  recommendedPattern: string;
  patternRoute: string;
  reason: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  protected readonly patterns: PatternCard[] = [
    {
      id: 'facade',
      name: 'Facade Pattern',
      category: 'Structural',
      route: '/facade',
      badge: 'Foundation Level',
      tagline: 'Hides complex multi-service workflows behind one clean, cohesive API.',
      problem: 'Components become bloated (600+ lines), injecting 6-8 underlying services (Cart, Tax, User, Wallet), making testing a nightmare.',
      solution: 'An @Injectable() facade aggregates underlying stores and exposes consolidated signals and computed states.',
      implementationHint: 'inject(CheckoutFacade) exposes computed() signals like subtotal and finalPayable.',
      highlights: ['Thin & testable components', 'Signal-based reactive consolidation', 'Single boundary for business logic']
    },
    {
      id: 'strategy',
      name: 'Strategy Pattern',
      category: 'Behavioral',
      route: '/strategy',
      badge: 'Production Level',
      tagline: 'Swaps algorithms or business rules at runtime without fragile if/else chains.',
      problem: 'Massive if (method === "UPI") ... else if ("CARD") chains that risk regressions whenever new rules or payment providers are added.',
      solution: 'Decoupled strategy classes implementing a common contract, registered with InjectionToken and { multi: true } or signal switching.',
      implementationHint: 'Open/Closed Principle: add new providers by creating 1 file and 1 provider entry—zero edits to existing code.',
      highlights: ['Zero if/else ladders', 'Multi-provider InjectionToken', 'Dynamic runtime algorithm selection']
    },
    {
      id: 'adapter',
      name: 'Adapter Pattern',
      category: 'Structural',
      route: '/adapter',
      badge: 'Enterprise Integration',
      tagline: 'Converts messy external/backend data shapes into clean, predictable UI models.',
      problem: 'Backend snake_case or legacy DTOs (emp_id, total_in_paise) leak into 20+ HTML templates; renaming a backend field breaks everything.',
      solution: 'Dedicated pure adapter functions and interfaces in data-access/ translate raw DTOs before components ever receive them.',
      implementationHint: 'RxJS map(dto => adaptDtoToUi(dto)) or pure mapper function isolating transformation logic.',
      highlights: ['Shields HTML templates from schema changes', 'Data normalization & null-safety', 'Decouples UI contracts from API DTOs']
    },
    {
      id: 'observer',
      name: 'Observer Pattern',
      category: 'Behavioral',
      route: '/observer',
      badge: 'Core Angular Reactivity',
      tagline: 'Automatically notifies multiple parts of the UI when state changes without tight coupling.',
      problem: 'Manual DOM mutations and scattered event emitters lead to desynchronized state and ghost memory leaks.',
      solution: 'Built natively into Angular 22+ via signal(), computed(), and effect(), plus RxJS Observables for asynchronous event streams.',
      implementationHint: 'Subject holds reactive state; components and effects subscribe automatically with glitch-free tracking.',
      highlights: ['Glitch-free signal dependency graph', 'Zero manual unsubscription leaks', 'Automatic side-effects with effect()']
    }
  ];

  protected readonly scenarios: DecisionScenario[] = [
    {
      problem: '"My component is injecting 5-7 different services just to render one checkout screen."',
      recommendedPattern: 'Facade Pattern',
      patternRoute: '/facade',
      reason: 'A Facade bundles CartItemsService, UserService, and TaxService into one entry point.'
    },
    {
      problem: '"I have a giant if/else ladder checking payment methods (UPI, Card, NetBanking, Crypto)."',
      recommendedPattern: 'Strategy Pattern',
      patternRoute: '/strategy',
      reason: 'Strategy encapsulates each payment method into its own class registered via InjectionToken.'
    },
    {
      problem: '"The backend JSON uses snake_case keys (usr_full_nm, amt_paise) and changes frequently."',
      recommendedPattern: 'Adapter Pattern',
      patternRoute: '/adapter',
      reason: 'Adapter translates raw backend DTOs into clean camelCase UI models inside the data-access layer.'
    },
    {
      problem: '"When a user changes font size or currency, 4 independent components must update immediately."',
      recommendedPattern: 'Observer Pattern',
      patternRoute: '/observer',
      reason: 'Angular Signals act as reactive Subjects notifying all template Observers automatically.'
    }
  ];

  protected readonly selectedScenario = signal<number | null>(null);

  protected selectScenario(index: number): void {
    this.selectedScenario.update(curr => curr === index ? null : index);
  }
}
