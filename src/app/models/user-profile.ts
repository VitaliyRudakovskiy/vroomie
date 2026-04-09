export interface UserProfile {
	uid: string;
	email: string;
	displayName: string;
	photoUrl: string | null;
	createdAt: number;
	friends: string[];
}
