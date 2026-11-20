import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NavbarComponent } from './navbar.component';
import { CartStoreService } from '../../../shared/data-access/cart/cart-store.service';

describe('NavbarComponent', () => {
  let cartStore: CartStoreService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        CartStoreService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    cartStore = TestBed.inject(CartStoreService);
  });

  it('should display the initial cart item count from CartStoreService', async () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.cart-badge')?.textContent?.trim()).toBe('1');
  });

  it('should reactively reflect updated item count when cartStore state changes', async () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();

    cartStore.addItem({
      productId: 'PRD-02',
      name: 'Wireless Mouse',
      unitPrice: 3200
    });

    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.cart-badge')?.textContent?.trim()).toBe('2');
  });
});
