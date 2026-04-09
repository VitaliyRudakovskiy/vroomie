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
	boughtDate: Date | null;
	lastServiceDate: Date | null;
	createdAt: Date | null;
}

export type CarWithoutId = Omit<Car, 'id'>;
