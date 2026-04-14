import { type CollectionReference, query, where } from '@angular/fire/firestore';

export const servicesByCarId = (servicesCollection: CollectionReference, carId: string) =>
	query(servicesCollection, where('carId', '==', carId));
