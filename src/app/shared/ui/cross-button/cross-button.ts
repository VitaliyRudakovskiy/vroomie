import { booleanAttribute, Component, input, output } from '@angular/core';

@Component({
	selector: 'app-cross-button',
	templateUrl: './cross-button.html',
	styleUrl: './cross-button.scss',
	host: {
		'[style.--top]': 'top()',
		'[style.--right]': 'right()',
		'[style.--size]': 'size()',
		'[style.--border-radius]': 'borderRadius()',
		'[style.transform]': 'centered() ? "translateY(-50%)" : "none"',
	},
})
export class CrossButton {
	top = input('16px');
	right = input('16px');
	size = input('32px');
	borderRadius = input('10px');
	centered = input(false, { transform: booleanAttribute });
	hoverText = input('Close modal');

	clicked = output<Event>();

	clickCrossButton(e: Event) {
		this.clicked.emit(e);
	}
}
