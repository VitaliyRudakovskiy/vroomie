import { UserProfile } from 'models/user-profile';

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

  const [name, secondName] = user.displayName.split(' ');
  return {
    isImage: false,
    details: `${name[0].toUpperCase()}${secondName[0].toUpperCase()}`,
  };
};
