import type { Timestamp } from '@angular/fire/firestore';

export interface Car {
	id: string;
	ownerId: string;
	make: string;
	model: string;
	year: number;
	boughtDate: Timestamp | null;
	bodyType: string;
	vin: string | null;
	currentOdometer: number;
	photoUrl: string | null;
	lastServiceDate: Timestamp | null;
	createdAt: Timestamp;
}

export type CarWithoutId = Omit<Car, 'id'>;
