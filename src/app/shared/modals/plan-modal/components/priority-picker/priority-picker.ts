import { Component, forwardRef, signal } from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { PriorityLevel } from 'models/plan';
import { PRIORITY_OPTIONS } from './options';

@Component({
	selector: 'app-priority-picker',
	templateUrl: './priority-picker.html',
	styleUrl: './priority-picker.scss',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => PriorityPickerComponent),
			multi: true,
		},
	],
})
export class PriorityPickerComponent implements ControlValueAccessor {
	value = signal<PriorityLevel>(0);
	disabled = signal(false);

	readonly options = PRIORITY_OPTIONS;

	// functions for ControlValueAccessor
	private onChange: (v: PriorityLevel) => void = () => {};
	private onTouched: () => void = () => {};

	writeValue(obj: PriorityLevel | null): void {
		this.value.set(obj === null || obj === undefined ? 0 : obj);
	}

	registerOnChange(fn: (v: PriorityLevel) => void): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.disabled.set(isDisabled);
	}

	prev(): void {
		if (this.disabled()) return;
		const next = this.value() === 0 ? 3 : ((this.value() - 1) as PriorityLevel);
		this.value.set(next);
		this.emit();
	}

	next(): void {
		if (this.disabled()) return;
		const next = this.value() === 3 ? 0 : ((this.value() + 1) as PriorityLevel);
		this.value.set(next);
		this.emit();
	}

	label() {
		return this.options[this.value()].label;
	}

	private emit(): void {
		this.onChange(this.value());
		this.onTouched();
	}
}
