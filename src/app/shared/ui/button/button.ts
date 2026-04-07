import { booleanAttribute, Component, input, output } from '@angular/core';
import type { ButtonSize, ButtonType, ButtonVariant, IconSize } from './types';

@Component({
	selector: 'app-button',
	templateUrl: './button.html',
	styleUrl: './button.scss',
})
export class Button {
	label = input('');
	variant = input<ButtonVariant>('primary');
	type = input<ButtonType>('button');
	size = input<ButtonSize>('md');
	loading = input(false);
	fullWidth = input(false, { transform: booleanAttribute });
	iconBefore = input<string | null>(null);
	iconAfter = input<string | null>(null);
	iconOnly = input<string | null>(null);
	iconAlt = input('');
	iconSize = input<IconSize | null>(null);
	disabled = input(false);

	clicked = output<MouseEvent>();

	onClick(event: MouseEvent): void {
		if (!this.disabled() && !this.loading()) {
			this.clicked.emit(event);
		}
	}
}
