export interface UserProfile {
	uid: string;
	email: string;
	displayName: string;
	photoUrl: string | null;
	createdAt: Date;
	friends: string[];
}
