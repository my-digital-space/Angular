import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

@Component({
  selector: 'app-action-button',
  // Separate HTML and CSS files keep logic clean and readable
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
