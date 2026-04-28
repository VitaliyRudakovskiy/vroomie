import type { PriorityLevel } from 'models/plan';

export const PRIORITY_OPTIONS: Record<PriorityLevel, { value: PriorityLevel; label: string }> = {
	0: { value: 0, label: 'Low priority' },
	1: { value: 1, label: 'Medium priority' },
	2: { value: 2, label: 'High priority' },
	3: { value: 3, label: 'Critical priority' },
} as const;
