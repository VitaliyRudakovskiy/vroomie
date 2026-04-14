import type { ServiceRecord } from 'models/service-record';

export interface ServicesState {
	services: ServiceRecord[];
	loading: boolean;
	error: string | null;
}
