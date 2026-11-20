import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActionButtonComponent } from './action-button.component';

describe('ActionButtonComponent', () => {
  let fixture: ComponentFixture<ActionButtonComponent>;
  let component: ActionButtonComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ActionButtonComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    fixture.componentRef.setInput('label', 'Click Me');
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render label text and default variant class', () => {
    fixture.componentRef.setInput('label', 'Submit');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button?.textContent.trim()).toBe('Submit');
    expect(button?.classList.contains('btn-primary')).toBe(true);
  });

  it('should apply variant class dynamically', () => {
    fixture.componentRef.setInput('label', 'Delete');
    fixture.componentRef.setInput('variant', 'danger');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button?.classList.contains('btn-danger')).toBe(true);
  });

  it('should emit buttonClick when clicked and not disabled', () => {
    fixture.componentRef.setInput('label', 'Confirm');
    fixture.detectChanges();

    let clicked = false;
    component.buttonClick.subscribe(() => {
      clicked = true;
    });

    const button = fixture.nativeElement.querySelector('button');
    button?.click();

    expect(clicked).toBe(true);
  });

  it('should not emit buttonClick when disabled', () => {
    fixture.componentRef.setInput('label', 'Disabled');
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    let clicked = false;
    component.buttonClick.subscribe(() => {
      clicked = true;
    });

    const button = fixture.nativeElement.querySelector('button');
    button?.click();

    expect(clicked).toBe(false);
  });
});
