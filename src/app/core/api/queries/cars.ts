import { type CollectionReference, query, where } from '@angular/fire/firestore';

export const carsByOwnerId = (carsCollection: CollectionReference, ownerId: string) =>
	query(carsCollection, where('ownerId', '==', ownerId));
