import { Directive, HostListener } from '@angular/core';

@Directive({
	selector: '[appOnlyNumbers]',
	standalone: true,
})
export class OnlyNumbersDirective {
	@HostListener('keydown', ['$event'])
	onKeyDown(event: KeyboardEvent) {
		const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete'];

		if (allowedKeys.indexOf(event.key) !== -1) return;

		const isNumber = /[0-9]/.test(event.key);
		if (!isNumber) {
			event.preventDefault();
		}
	}
}
