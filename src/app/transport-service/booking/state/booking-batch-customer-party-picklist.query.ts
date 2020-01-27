import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { BookingBatchCustomerPartyPicklistState, BookingBatchCustomerPartyPicklistStore } from './booking-batch-customer-party-picklist.store';


@Injectable({
    providedIn: 'root'
})
export class BookingBatchCustomerPartyPicklistQuery extends QueryEntity<BookingBatchCustomerPartyPicklistState> {
    constructor(protected store: BookingBatchCustomerPartyPicklistStore) {
        super(store);
    }
}
