export type PriorityLevel = 0 | 1 | 2 | 3; // 0 = low, 1 = medium, 2 = high, 3 = critical

export interface Plan {
	id: string;
	carId: string;
	ownerId: string;
	make: string;
	model: string;
	title: string;
	notes: string | null;
	priority: PriorityLevel;
	photoUrls: string[] | null;
	createdAt: number;
}

export type PlanWithoutId = Omit<Plan, 'id'>;
