export interface ServiceRecord {
	id: string;
	carId: string;
	ownerId: string;
	make: string;
	model: string;
	categoryId: string;
	categoryName: string;
	notes: string;
	odometer: number;
	cost: number | null;
	photoUrls: string[] | null;
	createdAt: number;
	completedAt: number;
}
