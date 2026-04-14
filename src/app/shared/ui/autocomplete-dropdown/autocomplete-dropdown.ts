import { Component, computed, input, output } from '@angular/core';
import { CAR_MAKES } from '@shared/constants/car-makes';

@Component({
	selector: 'app-autocomplete-dropdown',
	templateUrl: './autocomplete-dropdown.html',
	styleUrl: './autocomplete-dropdown.scss',
})
export class AutocompleteDropdown {
	makeSearchTerm = input.required<string>();

	selectMake = output<string>();

	protected carMakes = CAR_MAKES;

	filteredMakes = computed(() => {
		const term = this.makeSearchTerm().toLowerCase() || '';
		if (!term) return this.carMakes;

		return this.carMakes.filter((make) => make.toLowerCase().includes(term));
	});

	onSelect(make: string): void {
		this.selectMake.emit(make);
	}
}
