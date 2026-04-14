import { Component, inject, input, type OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Button, Loader } from '@shared/ui';
import { ServicesActions } from 'store/services/actions';
import { selectLoading, selectServices } from 'store/services/selectors';

@Component({
	selector: 'app-services',
	templateUrl: './services.html',
	styleUrl: './services.scss',
	imports: [Button, Loader],
})
export class Services implements OnInit {
	private readonly store = inject(Store);
	private readonly router = inject(Router);
	private readonly route = inject(ActivatedRoute);

	carId = input.required<string>();

	services = this.store.selectSignal(selectServices);
	loading = this.store.selectSignal(selectLoading);

	ngOnInit(): void {
		this.store.dispatch(ServicesActions.loadServices({ carId: this.carId() }));
	}

	goBack(): void {
		this.router.navigate(['..'], { relativeTo: this.route });
	}
}
