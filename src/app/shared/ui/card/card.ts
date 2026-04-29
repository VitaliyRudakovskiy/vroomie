import { booleanAttribute, Component, input, output } from '@angular/core';

@Component({
	selector: 'app-card',
	templateUrl: './card.html',
	styleUrl: './card.scss',
})
export class Card {
	maxWidth = input('100%');
	padding = input('24px');
  isInteractive = input(false, { transform: booleanAttribute });
  shadow = input('7px');

	clicked = output();

	onClick(): void {
		this.clicked.emit();
	}
}
