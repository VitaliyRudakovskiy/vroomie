import { Component, inject, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from '@shared/ui';

@Component({
	selector: 'app-plans',
	templateUrl: './plans.html',
	styleUrl: './plans.scss',
	imports: [Button],
})
export class Plans {
	private readonly router = inject(Router);
	private readonly route = inject(ActivatedRoute);

	carId = input.required<string>();

	goBack(): void {
		this.router.navigate(['..'], { relativeTo: this.route });
	}
}
