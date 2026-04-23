import type { Plan } from 'models/plan';

export interface PlansState {
	plans: Plan[];
	loading: boolean;
	error: string | null;
}
