import { Injectable, inject } from '@angular/core';
import {
	addDoc,
	collection,
	collectionData,
	doc,
	Firestore,
	getDocs,
	updateDoc,
	writeBatch,
} from '@angular/fire/firestore';
import { COLLECTIONS } from '@core/api/dbCollections';
import { carsByOwnerId } from '@core/api/queries/cars';
import { plansByCarId } from '@core/api/queries/plans';
import { servicesByCarId } from '@core/api/queries/services';
import type { Car, CarFormOnly, CarWithoutId } from 'models/car';
import { from, map, type Observable, switchMap } from 'rxjs';

type DeleteBatch = { collectionName: string; id: string };

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
		const servicesCollection = collection(this.firestore, COLLECTIONS.Services);
		const plansCollection = collection(this.firestore, COLLECTIONS.Plans);

		const servicesQuery = servicesByCarId(servicesCollection, carId);
		const plansQuery = plansByCarId(plansCollection, carId);

		return from(getDocs(servicesQuery)).pipe(
			switchMap((servicesSnap) =>
				from(getDocs(plansQuery)).pipe(map((plansSnap) => ({ servicesSnap, plansSnap }))),
			),
			switchMap(({ servicesSnap, plansSnap }) => {
				const deleteDocRefs: DeleteBatch[] = [];

				for (const s of servicesSnap.docs) {
					deleteDocRefs.push({ collectionName: COLLECTIONS.Services, id: s.id });
				}

				for (const p of plansSnap.docs) {
					deleteDocRefs.push({ collectionName: COLLECTIONS.Plans, id: p.id });
				}

				deleteDocRefs.push({ collectionName: COLLECTIONS.Cars, id: carId });

				// Firestore ограничение: максимум 500 операций в одном батче
				const CHUNK_SIZE = 350;
				const chunks: DeleteBatch[][] = [];

				for (let i = 0; i < deleteDocRefs.length; i += CHUNK_SIZE) {
					chunks.push(deleteDocRefs.slice(i, i + CHUNK_SIZE));
				}

				return from(this.commitDeleteChunks(chunks)).pipe(map(() => void 0));
			}),
		);
	}

	updateCar(carId: string, car: CarFormOnly): Observable<void> {
		const carDocRef = doc(this.firestore, COLLECTIONS.Cars, carId);
		return from(updateDoc(carDocRef, { ...car }));
	}

	private async commitDeleteChunks(chunks: DeleteBatch[][]): Promise<void> {
		for (const chunk of chunks) {
			const batch = writeBatch(this.firestore);
			for (const ref of chunk) {
				const docRef = doc(this.firestore, ref.collectionName, ref.id);
				batch.delete(docRef);
			}
			await batch.commit();
		}
	}
}
