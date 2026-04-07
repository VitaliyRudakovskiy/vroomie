import type { Timestamp } from '@angular/fire/firestore';

export interface Car {
	id: string;
	ownerId: string;
	make: string;
	model: string;
	year: number;
	boughtDate: Timestamp;
	bodyType: string;
	vin: string;
	currentOdometer: number;
	photoUrl: string | null;
	lastServiceDate: Timestamp;
	createdAt: Timestamp;
}
