import { Component, input } from '@angular/core';
import { ServiceRecord } from 'models/service-record';
import { Card } from '@shared/ui';
import { DatePipe } from '@angular/common';

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
