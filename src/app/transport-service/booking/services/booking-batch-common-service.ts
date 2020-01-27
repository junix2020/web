import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class BookingBatchCommonService {

    bookingBatch$ = new BehaviorSubject<any>(
        {
            "bookingBatchID": null
        }
    )

    flag$ = new BehaviorSubject<any>(
        {
            flag: false
        }
    )

    status$ = new BehaviorSubject<any>(
        {
            status: null
        }
    )
    setNewBookingBatchFlag(params) {
        this.flag$.next(params);
    }

    setBookingBatchId(params) {
        this.bookingBatch$.next(params);
    }

    setStatus(params) {
        this.status$.next(params);
    }
}
