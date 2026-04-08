import { inject, Injectable } from '@angular/core';
import { collection, collectionData, Firestore, query, where } from '@angular/fire/firestore';
import { COLLECTIONS } from '@core/api/dbCollections';
import { Car } from 'models/car';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GarageService {
	private readonly firestore = inject(Firestore);

	getCarsByOwnerId(ownerId: string): Observable<Car[]> {
		const carsCollection = collection(this.firestore, COLLECTIONS.Cars);
		const carsQuery = query(carsCollection, where('ownerId', '==', ownerId));
		return collectionData(carsQuery) as Observable<Car[]>;
	}
}
