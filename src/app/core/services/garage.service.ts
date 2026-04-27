import { Injectable, inject } from '@angular/core';
import {
	addDoc,
	collection,
	collectionData,
	deleteDoc,
	doc,
	Firestore,
	updateDoc,
} from '@angular/fire/firestore';
import { COLLECTIONS } from '@core/api/dbCollections';
import { carsByOwnerId } from '@core/api/queries/cars';
import type { Car, CarFormOnly, CarWithoutId } from 'models/car';
import { from, map, type Observable } from 'rxjs';

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

	deleteCar(carId: string): Observable<void> {
		const carDocRef = doc(this.firestore, COLLECTIONS.Cars, carId);
		return from(deleteDoc(carDocRef));
	}

	updateCar(carId: string, car: CarFormOnly): Observable<void> {
		const carDocRef = doc(this.firestore, COLLECTIONS.Cars, carId);
		return from(updateDoc(carDocRef, { ...car }));
	}
}
