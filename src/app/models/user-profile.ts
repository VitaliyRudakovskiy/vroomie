import type { Timestamp } from '@angular/fire/firestore';

export interface UserProfile {
	uid: string;
	email: string;
	displayName: string;
	photoUrl: string | null;
	createdAt: Timestamp;
	friends: string[];
}
