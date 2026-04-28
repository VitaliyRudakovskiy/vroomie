import { Component, effect, inject, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { hasValidationError } from '@core/helpers/has-validation-error';
import { UserService } from '@core/services/user.service';
import { USER_CONFIG } from '@shared/constants/user-config';
import { Button, ModalWrapper } from '@shared/ui';

@Component({
	selector: 'app-change-name-modal',
	templateUrl: './change-name-modal.html',
	styleUrl: './change-name-modal.scss',
	imports: [ModalWrapper, ReactiveFormsModule, Button],
})
export class ChangeNameModal {
	private readonly userService = inject(UserService);

	visible = input.required<boolean>();
	initialName = input.required<string>();

	closeModal = output();

	protected readonly config = USER_CONFIG;

	userForm = new FormGroup({
		displayName: new FormControl('', [
			Validators.required,
			Validators.minLength(this.config.displayName.min),
			Validators.maxLength(this.config.displayName.max),
		]),
	});

	constructor() {
		effect(() => {
			const name = this.initialName();
			if (!name) return;

			this.userForm.patchValue({ displayName: name }, { emitEvent: false });
		});

		effect(() => {
			if (this.visible()) {
				this.userForm.patchValue({ displayName: this.initialName() }, { emitEvent: false });
			}
		});
	}

	onSave(): void {
		const newName = this.userForm.value.displayName;
		if (!newName) return;

		this.userService.updateUserProfile({ displayName: newName });
		this.onClose();
	}

	onClose(): void {
		this.closeModal.emit();
	}

	protected hasError(control: keyof typeof this.userForm.controls) {
		return hasValidationError(this.userForm, control);
	}
}
