import type { UserProfile } from 'models/user-profile';
import { describe, expect, it } from 'vitest';
import { getUserAvatar } from './get-user-avatar';

function user(data: Partial<UserProfile>): UserProfile {
	return {
		uid: '1',
		email: 'test@test.com',
		displayName: '',
		photoUrl: '',
		createdAt: 0,
		friends: [],
		...data,
	};
}

describe('getUserAvatar', () => {
	it('returns empty details when user is null', () => {
		expect(getUserAvatar(null)).toEqual({
			isImage: false,
			details: '',
		});
	});

	it('returns photoUrl when user has an image', () => {
		const result = getUserAvatar(
			user({
				displayName: 'John Doe',
				photoUrl: 'http://example.com/avatar.png',
			}),
		);

		expect(result).toEqual({
			isImage: true,
			details: 'http://example.com/avatar.png',
		});
	});

	it('returns first letter for single-word name', () => {
		expect(getUserAvatar(user({ displayName: 'john' }))).toEqual({
			isImage: false,
			details: 'J',
		});

		expect(getUserAvatar(user({ displayName: 'Анна' }))).toEqual({
			isImage: false,
			details: 'А',
		});
	});

	it('returns initials for two-word name', () => {
		expect(getUserAvatar(user({ displayName: 'John Doe' }))).toEqual({
			isImage: false,
			details: 'JD',
		});

		expect(getUserAvatar(user({ displayName: 'Анна Каренина' }))).toEqual({
			isImage: false,
			details: 'АК',
		});
	});

	it('returns initials of first two words for long names', () => {
		expect(
			getUserAvatar(
				user({
					displayName: 'John Ronald Reuel Tolkien',
				}),
			),
		).toEqual({
			isImage: false,
			details: 'JR',
		});
	});

	it('trims extra spaces and still works', () => {
		expect(getUserAvatar(user({ displayName: '   John   Doe   ' }))).toEqual({
			isImage: false,
			details: 'JD',
		});
	});
});
