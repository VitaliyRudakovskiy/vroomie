export interface ServiceRecord {
	id: string;
	carId: string;
	ownerId: string;
	make: string;
	model: string;
	title: string;
	notes: string;
	odometer: number;
	date: number;
	photoUrls: string[] | null;
	createdAt: number;
}

export type ServiceRecordWithoutId = Omit<ServiceRecord, 'id'>;
