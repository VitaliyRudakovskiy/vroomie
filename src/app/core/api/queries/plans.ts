import { type CollectionReference, query, where } from '@angular/fire/firestore';
import { orderBy } from 'firebase/firestore';

export const plansByCarId = (plansCollection: CollectionReference, carId: string) =>
	query(plansCollection, where('carId', '==', carId), orderBy('createdAt', 'desc'));
