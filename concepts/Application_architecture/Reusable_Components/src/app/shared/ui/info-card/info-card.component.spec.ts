import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoCardComponent } from './info-card.component';

@Component({
  imports: [InfoCardComponent],
  template: `
    <app-info-card [title]="title()" [subtitle]="subtitle()" [dismissible]="dismissible()" (dismissed)="onDismiss()">
      <div card-body>
        <span class="test-body">Body Content</span>
      </div>
      <div card-footer>
        <span class="test-footer">Footer Content</span>
      </div>
    </app-info-card>
  `
})
class TestHostComponent {
  title = signal('Test Title');
  subtitle = signal('Test Subtitle');
  dismissible = signal(false);
  dismissedCalled = signal(false);

  onDismiss(): void {
    this.dismissedCalled.set(true);
  }
}

describe('InfoCardComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, InfoCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render title and subtitle', () => {
    const titleEl = fixture.nativeElement.querySelector('.card-title');
    const subtitleEl = fixture.nativeElement.querySelector('.card-subtitle');

    expect(titleEl?.textContent.trim()).toBe('Test Title');
    expect(subtitleEl?.textContent.trim()).toBe('Test Subtitle');
  });

  it('should project body and footer content into matching slots', () => {
    const bodyContent = fixture.nativeElement.querySelector('.card-body .test-body');
    const footerContent = fixture.nativeElement.querySelector('.card-footer .test-footer');

    expect(bodyContent).toBeTruthy();
    expect(bodyContent?.textContent.trim()).toBe('Body Content');
    expect(footerContent).toBeTruthy();
    expect(footerContent?.textContent.trim()).toBe('Footer Content');
  });

  it('should show dismiss button when dismissible is true and emit on click', () => {
    expect(fixture.nativeElement.querySelector('.dismiss-btn')).toBeFalsy();

    host.dismissible.set(true);
    fixture.detectChanges();

    const dismissBtn = fixture.nativeElement.querySelector('.dismiss-btn');
    expect(dismissBtn).toBeTruthy();

    dismissBtn.click();
    expect(host.dismissedCalled()).toBe(true);
  });
});
