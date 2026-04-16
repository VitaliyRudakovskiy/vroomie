import { Injectable, inject } from '@angular/core';
import { addDoc, collection, collectionData, Firestore } from '@angular/fire/firestore';
import { COLLECTIONS } from '@core/api/dbCollections';
import { servicesByCarId } from '@core/api/queries/services';
import type { ServiceRecord, ServiceRecordWithoutId } from 'models/service-record';
import { from, map, type Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ServicesService {
	private readonly firestore = inject(Firestore);

	getServicesByCarId(carId: string): Observable<ServiceRecord[]> {
		const services = collection(this.firestore, COLLECTIONS.Services);
		const servicesQuery = servicesByCarId(services, carId);
		return collectionData(servicesQuery, { idField: 'id' }) as Observable<ServiceRecord[]>;
	}

	addService(serviceRecord: ServiceRecordWithoutId): Observable<ServiceRecord> {
		const services = collection(this.firestore, COLLECTIONS.Services);
		return from(addDoc(services, serviceRecord)).pipe(
			map((doc) => ({ ...serviceRecord, id: doc.id })),
		);
	}
}
