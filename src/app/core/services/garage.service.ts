// import { Injectable, inject } from '@angular/core';
// import {
// 	addDoc,
// 	collection,
// 	collectionData,
// 	Firestore,
// 	query,
// 	where,
// } from '@angular/fire/firestore';
// import { COLLECTIONS } from '@core/api/dbCollections';
// import type { Car, CarWithoutId } from 'models/car';
// import { from, map, type Observable } from 'rxjs';

// @Injectable({ providedIn: 'root' })
// export class GarageService {
// 	private readonly firestore = inject(Firestore);

// 	getCarsByOwnerId(ownerId: string): Observable<Car[]> {
// 		const cars = collection(this.firestore, COLLECTIONS.Cars);
// 		const carsQuery = query(cars, where('ownerId', '==', ownerId));

// 		return (collectionData(carsQuery, { idField: 'id' }) as Observable<Car[]>).pipe(
// 			map((cars) =>
// 				cars.map((car) => ({
// 					...car,
// 					boughtDate: car.boughtDate ?? null,
// 					lastServiceDate: car.lastServiceDate ?? null,
// 					createdAt: car.createdAt ?? null,
// 				})),
// 			),
// 		);
// 	}

// 	addCar(car: CarWithoutId): Observable<Car> {
// 		const cars = collection(this.firestore, COLLECTIONS.Cars);
// 		return from(addDoc(cars, car)).pipe(map((docRef) => ({ ...car, id: docRef.id })));
// 	}
// }

import { isPlatformBrowser } from '@angular/common';
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { getApp } from '@angular/fire/app';
import {
	addDoc,
	collection,
	collectionData,
	type Firestore,
	getFirestore,
	query,
	where,
} from '@angular/fire/firestore';
import { COLLECTIONS } from '@core/api/dbCollections';
import type { Car, CarWithoutId } from 'models/car';
import { from, map, type Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GarageService {
	private readonly platformId = inject(PLATFORM_ID);
	private firestore: Firestore | null = null;

	private getDb(): Firestore | null {
		if (!isPlatformBrowser(this.platformId)) {
			return null;
		}

		// Если еще не инициализировали - берем инстанс напрямую из Firebase App
		if (!this.firestore) {
			try {
				this.firestore = getFirestore(getApp());
			} catch (_e) {
				return null;
			}
		}
		return this.firestore;
	}

	getCarsByOwnerId(ownerId: string): Observable<Car[]> {
		const db = this.getDb();
		if (!db) {
			return of([]); // На сервере/билде просто возвращаем пустой массив
		}

		const cars = collection(db, COLLECTIONS.Cars);
		const carsQuery = query(cars, where('ownerId', '==', ownerId));

		return (collectionData(carsQuery, { idField: 'id' }) as Observable<any[]>).pipe(
			map((cars) =>
				cars.map(
					(car) =>
						({
							...car,
							boughtDate: car.boughtDate?.toMillis?.() || car.boughtDate || null,
							lastServiceDate: car.lastServiceDate?.toMillis?.() || car.lastServiceDate || null,
							createdAt: car.createdAt?.toMillis?.() || car.createdAt || null,
						}) as Car,
				),
			),
		);
	}

	addCar(car: CarWithoutId): Observable<Car> {
		const db = this.getDb();
		if (!db) {
			return of();
		}

		const carWithDate = { ...car, createdAt: Date.now() };
		return from(addDoc(collection(db, COLLECTIONS.Cars), carWithDate)).pipe(
			map((docRef) => ({ ...car, id: docRef.id, createdAt: carWithDate.createdAt })),
		);
	}
}
