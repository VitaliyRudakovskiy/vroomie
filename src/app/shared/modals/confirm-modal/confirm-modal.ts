import { Component, computed, input, output } from '@angular/core';
import { Button, ModalWrapper } from '@shared/ui';

@Component({
	selector: 'app-confirm-modal',
	imports: [Button, ModalWrapper],
	templateUrl: './confirm-modal.html',
	styleUrl: './confirm-modal.scss',
})
export class ConfirmModal {
	visible = input.required<boolean>();

	modalTitle = input.required<string>();
	description = input.required<string | string[]>();
	confirmLabel = input('Yes');
	cancelLabel = input('Cancel');
	loading = input(false);

	isDescriptionArray = computed(() => Array.isArray(this.description()));

	confirm = output<void>();
	cancelEvent = output<void>();

	onClose(): void {
		this.cancelEvent.emit();
	}

	onApply(): void {
		this.confirm.emit();
	}
}
