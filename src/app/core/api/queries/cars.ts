import { type CollectionReference, query, where } from '@angular/fire/firestore';
import { orderBy } from 'firebase/firestore';

export const carsByOwnerId = (carsCollection: CollectionReference, ownerId: string) =>
	query(carsCollection, where('ownerId', '==', ownerId), orderBy('createdAt', 'desc'));
