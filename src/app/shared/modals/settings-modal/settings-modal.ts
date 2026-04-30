import { Component, input, output } from '@angular/core';
import { ModalWrapper } from '@shared/ui';

@Component({
	selector: 'app-settings-modal',
	templateUrl: './settings-modal.html',
	styleUrl: './settings-modal.scss',
	imports: [ModalWrapper],
})
export class SettingsModal {
	visible = input.required<boolean>();

	closeModal = output();

	onClose(): void {
		this.closeModal.emit();
	}
}
