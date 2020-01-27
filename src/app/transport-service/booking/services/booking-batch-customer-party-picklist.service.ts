import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BookingBatchCustomerPartyPicklistStore } from '../state/booking-batch-customer-party-picklist.store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { BookingBatchCustomerPartyPicklistDTO } from '../dto/booking-batch-customer-party-picklist.dto';


@Injectable({
    providedIn: 'root'
})
export class BookingBatchCustomerPartyPicklistService {
    constructor(
        private http: HttpClient,
        private bookingBatchCustomerPartyPicklistStore: BookingBatchCustomerPartyPicklistStore
    ) { }

    getBookingBatchCustomerParties(): Observable<BookingBatchCustomerPartyPicklistDTO[]> {
        const request = this.http
            .get<BookingBatchCustomerPartyPicklistDTO[]>(`${environment.apiUrl}/booking-batch-customer-party`).pipe(
                tap(res => {
                    this.bookingBatchCustomerPartyPicklistStore.set(res);
                }
                ));
        return request;
    }

}
