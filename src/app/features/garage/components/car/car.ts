import { Component, inject, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Card } from '@shared/ui';
import type { Car as TCar } from 'models/car';

@Component({
	selector: 'app-car',
	templateUrl: './car.html',
	styleUrl: './car.scss',
	imports: [Card],
})
export class Car {
	private readonly router = inject(Router);
	private readonly route = inject(ActivatedRoute);

	car = input.required<TCar>();

	clickCard(): void {
		const id = this.car().id;
		if (!id) {
			return;
		}

		this.router.navigate([id], { relativeTo: this.route });
	}
}
