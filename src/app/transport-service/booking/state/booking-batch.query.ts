import { Injectable } from '@angular/core';
import { BookingBatchState, BookingBatchStore } from './booking-batch.store';
import { QueryEntity } from '@datorama/akita';


@Injectable({
    providedIn: 'root'
})
export class BookingBatchQuery extends QueryEntity<BookingBatchState> {
    constructor(protected store: BookingBatchStore) {
        super(store);
    }
}