export interface Car {
	id: string;
	ownerId: string;
	make: string;
	model: string;
	vin: string | null;
	currentOdometer: number;
	photoUrl: string | null;
	createdAt: number;
}

export type CarWithoutId = Omit<Car, 'id'>;

export type CarFormOnly = Pick<Car, 'make' | 'model' | 'vin' | 'currentOdometer'>;
