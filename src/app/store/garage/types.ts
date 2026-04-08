import { Car } from 'models/car';

export interface GarageState {
	cars: Car[];
	loading: boolean;
	error: string | null;
}
