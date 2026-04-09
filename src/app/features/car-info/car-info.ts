import { Component, inject, input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { CarInfoActions } from 'store/car-info/actions';
import { selectCarInfo, selectCarInfoLoading } from 'store/car-info/selectors';
import { Loader } from '@shared/ui';

@Component({
	selector: 'app-car-info',
	templateUrl: './car-info.html',
	styleUrl: './car-info.scss',
	imports: [Loader],
})
export class CarInfo implements OnInit {
	private readonly store = inject(Store);

	carId = input.required<string>();

	loading = this.store.selectSignal(selectCarInfoLoading);
	carInfo = this.store.selectSignal(selectCarInfo);

	ngOnInit(): void {
		this.store.dispatch(CarInfoActions.loadCarInfo({ carId: this.carId() }));
	}
}
