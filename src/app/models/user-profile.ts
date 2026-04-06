import { Timestamp } from '@angular/fire/firestore';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  status?: string;
  photoUrl: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
