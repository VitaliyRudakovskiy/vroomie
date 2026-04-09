import { Injectable, inject } from '@angular/core';
import {
	addDoc,
	collection,
	collectionData,
	Firestore,
	query,
	serverTimestamp,
	where,
} from '@angular/fire/firestore';
import { COLLECTIONS } from '@core/api/dbCollections';
import type { Car, CarWithoutId } from 'models/car';
import { from, map, type Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GarageService {
	private readonly firestore = inject(Firestore);

	getCarsByOwnerId(ownerId: string): Observable<Car[]> {
		const cars = collection(this.firestore, COLLECTIONS.Cars);
		const carsQuery = query(cars, where('ownerId', '==', ownerId));
		return collectionData(carsQuery, { idField: 'id' }) as Observable<Car[]>;
	}

	addCar(car: CarWithoutId): Observable<Car> {
		const cars = collection(this.firestore, COLLECTIONS.Cars);

		const carWithTimestamps = {
			...car,
			createdAt: serverTimestamp(),
		};

		return from(addDoc(cars, carWithTimestamps)).pipe(map((docRef) => ({ ...car, id: docRef.id })));
	}
}
