import { BookingBatchDTO } from '../dto/booking-batch.dto';
import { EntityState, StoreConfig, EntityStore } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface BookingBatchState extends EntityState<BookingBatchDTO> {}

@Injectable({
  providedIn: 'root'
})
    @StoreConfig({ name: 'bookingBatch', idKey: 'bookingBatchID' })
export class BookingBatchStore extends EntityStore<BookingBatchState> {
  constructor() {
    super();
  }
}
