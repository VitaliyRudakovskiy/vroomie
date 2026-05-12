import type { AbstractControl } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { dateValidator } from './date-validator';

function control(value: any): AbstractControl {
	return { value } as AbstractControl;
}

describe('dateValidator', () => {
	it('returns null for empty value', () => {
		expect(dateValidator(control(null))).toBeNull();
		expect(dateValidator(control(''))).toBeNull();
	});

	it('validates correct date', () => {
		expect(dateValidator(control('12.05.2024'))).toBeNull();
	});

	it('returns invalidFormat for wrong format', () => {
		expect(dateValidator(control('2024-05-12'))).toEqual({ invalidFormat: true });
		expect(dateValidator(control('12/05/2024'))).toEqual({ invalidFormat: true });
	});

	it('returns invalidMonth for month < 1 or > 12', () => {
		expect(dateValidator(control('10.00.2024'))).toEqual({ invalidMonth: true });
		expect(dateValidator(control('10.13.2024'))).toEqual({ invalidMonth: true });
	});

	it('returns invalidDay for day < 1 or > 31', () => {
		expect(dateValidator(control('00.05.2024'))).toEqual({ invalidDay: true });
		expect(dateValidator(control('32.05.2024'))).toEqual({ invalidDay: true });
	});

	it('returns invalidYear for future year', () => {
		const nextYear = new Date().getFullYear() + 1;
		expect(dateValidator(control(`10.10.${nextYear}`))).toEqual({ invalidYear: true });
	});

	it('returns invalidDate for non-existent date', () => {
		expect(dateValidator(control('31.02.2024'))).toEqual({ invalidDate: true });
		expect(dateValidator(control('29.02.2023'))).toEqual({ invalidDate: true });
	});
});
