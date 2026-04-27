import type { FormGroup } from '@angular/forms';

export const hasValidationError = <T extends FormGroup>(
	form: T,
	controlName: keyof T['controls'],
) => {
	const control = form.controls[controlName as string];
	return !!(control?.touched && control?.invalid);
};
