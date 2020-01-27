import { EntityState, StoreConfig, EntityStore } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { BookingBatchCustomerPartyPicklistDTO } from '../dto/booking-batch-customer-party-picklist.dto';


export interface BookingBatchCustomerPartyPicklistState extends EntityState<BookingBatchCustomerPartyPicklistDTO> { }

@Injectable({
    providedIn: 'root'
})
@StoreConfig({ name: 'bookingBatch', idKey: 'partyID' })
export class BookingBatchCustomerPartyPicklistStore extends EntityStore<BookingBatchCustomerPartyPicklistState> {
    constructor() {
        super();
    }
}
