import { FormControl, FormGroup, Validators } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { hasValidationError } from './has-validation-error';

describe('hasValidationError', () => {
	it('returns false when control does not exist', () => {
		const form = new FormGroup({
			name: new FormControl('test'),
		});

		// @ts-expect-error — intentionally wrong control name
		expect(hasValidationError(form, 'unknown')).toBe(false);
	});

	it('returns false when control exists but not touched', () => {
		const form = new FormGroup({
			name: new FormControl('', Validators.required),
		});

		expect(hasValidationError(form, 'name')).toBe(false);
	});

	it('returns false when control is touched but valid', () => {
		const form = new FormGroup({
			name: new FormControl('John', Validators.required),
		});

		form.controls['name'].markAsTouched();
		expect(hasValidationError(form, 'name')).toBe(false);
	});

	it('returns true when control is touched and invalid', () => {
		const form = new FormGroup({
			name: new FormControl('', Validators.required),
		});

		form.controls['name'].markAsTouched();
		expect(hasValidationError(form, 'name')).toBe(true);
	});

	it('works with multiple controls', () => {
		const form = new FormGroup({
			email: new FormControl('', [Validators.required, Validators.email]),
			password: new FormControl('123456'),
		});

		form.controls['email'].markAsTouched();
		expect(hasValidationError(form, 'email')).toBe(true);
		expect(hasValidationError(form, 'password')).toBe(false);
	});
});
