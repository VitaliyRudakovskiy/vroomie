import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
	selector: '[appOnlyNumbers]',
	standalone: true,
})
export class OnlyNumbersDirective {
	private readonly elementRef = inject(ElementRef);

	ngOnInit() {
		this.elementRef.nativeElement.setAttribute('inputmode', 'numeric');
		this.elementRef.nativeElement.setAttribute('pattern', '[0-9]*');
	}

	@HostListener('keydown', ['$event'])
	onKeyDown(event: KeyboardEvent) {
		const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
		if (allowedKeys.includes(event.key)) return;

		const hotKeys = ['a', 'c', 'v', 'x'];
		if ((event.ctrlKey || event.metaKey) && hotKeys.includes(event.key.toLowerCase())) {
			return;
		}

		const isNumber = /[0-9]/.test(event.key);
		if (!isNumber) event.preventDefault();
	}

	@HostListener('input', ['$event'])
	onInput(event: Event) {
		const input = event.target as HTMLInputElement;
		const cleaned = input.value.replace(/\D/g, '');

		if (input.value !== cleaned) {
			input.value = cleaned;
			input.dispatchEvent(new Event('input', { bubbles: true }));
		}
	}
}
