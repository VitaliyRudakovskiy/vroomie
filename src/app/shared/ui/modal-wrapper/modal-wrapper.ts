import { Component, input, output } from '@angular/core';

@Component({
	selector: 'app-modal-wrapper',
	templateUrl: './modal-wrapper.html',
	styleUrl: './modal-wrapper.scss',
})
export class ModalWrapper {
	visible = input.required<boolean>();
	modalTitle = input.required<string>();
	closeModal = output();

	onClose(): void {
		this.closeModal.emit();
	}
}
