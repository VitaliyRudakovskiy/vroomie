import { type CollectionReference, query, where } from '@angular/fire/firestore';
import { orderBy } from 'firebase/firestore';

export const servicesByCarId = (servicesCollection: CollectionReference, carId: string) =>
	query(servicesCollection, where('carId', '==', carId), orderBy('createdAt', 'desc'));
