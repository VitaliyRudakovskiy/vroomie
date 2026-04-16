import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { Card } from '@shared/ui';
import type { ServiceRecord } from 'models/service-record';

@Component({
	selector: 'app-service-card',
	templateUrl: './service-card.html',
	styleUrl: './service-card.scss',
	imports: [Card, DatePipe],
})
export class ServiceCard {
	serviceInfo = input.required<ServiceRecord>();

	convertDate(dateMs: number): Date {
		return new Date(dateMs);
	}

	clickCard(): void {}
}
