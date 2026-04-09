import type { Car } from 'models/car';

export interface CarInfoState {
	carInfo: Car | null;
	loading: boolean;
	error: string | null;
}
