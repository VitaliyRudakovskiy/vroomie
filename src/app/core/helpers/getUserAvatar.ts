import type { UserProfile } from 'models/user-profile';

export interface UserAvatarDetails {
	isImage: boolean;
	details: string;
}

export const getUserAvatar = (user: UserProfile | null): UserAvatarDetails => {
	if (!user) return { isImage: false, details: '' };

	if (user?.photoUrl) {
		return {
			isImage: true,
			details: user.photoUrl,
		};
	}

	const parts = user.displayName.trim().split(/\s+/);

	if (parts.length === 0) {
		return { isImage: false, details: '?' };
	}

	if (parts.length === 1) {
		return {
			isImage: false,
			details: parts[0][0].toUpperCase(),
		};
	}

	return {
		isImage: false,
		details: `${parts[0][0].toUpperCase()}${parts[1][0].toUpperCase()}`,
	};
};
