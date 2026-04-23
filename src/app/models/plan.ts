export interface Plan {
	id: string;
	carId: string;
	ownerId: string;
	make: string;
	model: string;
	title: string;
	notes: string | null;
	priority: number; // 0 = low, 1 = medium, 2 = high, 3 = critical
	photoUrls: string[] | null;
	createdAt: number;
}

export type PlanWithoutId = Omit<Plan, 'id'>;
