import { Injectable, inject } from '@angular/core';
import {
	addDoc,
	collection,
	collectionData,
	Firestore,
	query,
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

		return (collectionData(carsQuery, { idField: 'id' }) as Observable<Car[]>).pipe(
			map((cars) =>
				cars.map(
					(car) =>
						({
							...car,
							boughtDate: car.boughtDate ?? null,
							lastServiceDate: car.lastServiceDate ?? null,
							createdAt: car.createdAt ?? null,
						}) as Car,
				),
			),
		);
	}

	addCar(car: CarWithoutId): Observable<Car> {
		const cars = collection(this.firestore, COLLECTIONS.Cars);

		const carWithDate = {
			...car,
			createdAt: Date.now(),
		};

		return from(addDoc(cars, carWithDate)).pipe(map((docRef) => ({ ...car, id: docRef.id })));
	}
}
