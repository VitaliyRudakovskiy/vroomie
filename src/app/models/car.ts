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
	boughtDate: number | null;
	lastServiceDate: number | null;
	createdAt: number | null;
}

export type CarWithoutId = Omit<Car, 'id'>;
