import { Component, input, output } from '@angular/core';
import { CrossButton } from '../cross-button';

@Component({
	selector: 'app-modal-wrapper',
	templateUrl: './modal-wrapper.html',
	styleUrl: './modal-wrapper.scss',
	imports: [CrossButton],
})
export class ModalWrapper {
	visible = input.required<boolean>();
	modalTitle = input.required<string>();
	innerPadding = input(20);

	closeModal = output();

	onClose(_e: Event): void {
		this.closeModal.emit();
	}
}
