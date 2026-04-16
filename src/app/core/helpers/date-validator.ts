import { AbstractControl, ValidationErrors } from '@angular/forms';

export function dateValidator(control: AbstractControl): ValidationErrors | null {
	const value = control.value;
	if (!value) return null;

	const regex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
	const match = value.match(regex);
	if (!match) return { invalidFormat: true };

	const day = Number(match[1]);
	const month = Number(match[2]);
	const year = Number(match[3]);

	const now = new Date();
	const currentYear = now.getFullYear();

	if (month < 1 || month > 12) return { invalidMonth: true };
	if (day < 1 || day > 31) return { invalidDay: true };
	if (year > currentYear) return { invalidYear: true };

	const date = new Date(year, month - 1, day);

	if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day)
		return { invalidDate: true };

	return null;
}
