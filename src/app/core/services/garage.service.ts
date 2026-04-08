import { inject, Injectable } from '@angular/core';
import {
	addDoc,
	collection,
	collectionData,
	Firestore,
	query,
	where,
} from '@angular/fire/firestore';
import { COLLECTIONS } from '@core/api/dbCollections';
import { carsByOwnerId } from '@core/api/queries/cars';
import { Car, CarWithoutId } from 'models/car';
import { from, map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GarageService {
	private readonly firestore = inject(Firestore);

	getCarsByOwnerId(ownerId: string): Observable<Car[]> {
		const cars = collection(this.firestore, COLLECTIONS.Cars);
		const carsQuery = carsByOwnerId(cars, ownerId);
		return collectionData(carsQuery, { idField: 'id' }) as Observable<Car[]>;
	}

	addCar(car: CarWithoutId): Observable<Car> {
		const cars = collection(this.firestore, COLLECTIONS.Cars);
		return from(addDoc(cars, car)).pipe(map((docRef) => ({ ...car, id: docRef.id })));
	}
}
