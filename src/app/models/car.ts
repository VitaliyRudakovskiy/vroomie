import type { Timestamp } from '@angular/fire/firestore';

export interface Car {
	id: string;
	ownerId: string;
	make: string;
	model: string;
	year: number;
	bodyType: string;
	vin: string | null;
	currentOdometer: number;
	photoUrl: string | null;
	boughtDate: Timestamp | null;
	lastServiceDate: Timestamp | null;
	createdAt: Timestamp | null;
}

export type CarWithoutId = Omit<Car, 'id'>;
