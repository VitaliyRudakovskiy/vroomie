import { Component, input } from '@angular/core';
import { Card } from '@shared/ui';
import type { Car as TCar } from 'models/car';

@Component({
	selector: 'app-car',
	templateUrl: './car.html',
	styleUrl: './car.scss',
	imports: [Card],
})
export class Car {
	car = input.required<TCar>();
}
