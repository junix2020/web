import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { NzNotificationService } from 'ng-zorro-antd';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { BookingBatchDTO } from '../dto/booking-batch.dto';
import { BookingBatch } from '../models/booking-batch.model';
import { BookingBatchQuery } from '../state/booking-batch.query';
import { BookingBatchStore } from '../state/booking-batch.store';
import { BookingBatchCommonService } from './booking-batch-common-service';


@Injectable()
export class BookingBatchService {
    bookingBatch = new BookingBatch();
    
    constructor(
        private http: HttpClient,
        private notification: NzNotificationService,
        private bookingBatchStore: BookingBatchStore,
        private bookingBatchQuery: BookingBatchQuery,
        private bookingBatchCommonService: BookingBatchCommonService,
    ) {

    }
      
    getBookingBatches(): Observable<BookingBatchDTO[]> {
         const request = this.http
            .get<BookingBatchDTO[]>(`${environment.apiUrl}/booking-batch`).pipe(
                tap(res => {
                    this.bookingBatchStore.set(res);
                }
                ));
        return request;
    }

    // delete booking batch single or multiple ids
    deleteBookingBatchByIDs(bookingBatchIDs: ID[]) {
        return this.http.post<BookingBatch>(`${environment.apiUrl + '/booking-batch'}/delete`, bookingBatchIDs).pipe(
           tap(() => this.bookingBatchStore.remove(bookingBatchIDs)),
        );
    }

    getBookingBatchByID(bookingBatchId: string): Observable<BookingBatchDTO> {
         return this.http.get<BookingBatchDTO>(`${environment.apiUrl}/booking-batch/${bookingBatchId}`);
    }

    // delete booking batch by id
    deleteBookingBatchByID(bookingBatchId: string): any {
        return this.http.delete<void>(`${environment.apiUrl}/booking-batch/${bookingBatchId}`)
            .pipe(
                tap(() => this.bookingBatchStore.remove(bookingBatchId))
            ).subscribe();
    }

    // post booking batch to server and update/insert store
    saveBookingBatch(data: BookingBatchDTO, status: string) {
        var body = {
            ...data
        }

        // post booking batch to server
        this.http.post<BookingBatchDTO>(`${environment.apiUrl + '/booking-batch'}/save`, body)
            .subscribe(res => {
                if (status == 'edit' || status == 'view') {
                    // update store bookingBatch
                    this.bookingBatchStore.update(data.bookingBatchID, {
                        batchCode: data.batchCode,
                        name: data.name,
                        description: data.description,
                        creationDate: data.creationDate,
                        bookingSlipQuantity: data.bookingSlipQuantity,
                        bookingPartyID: data.bookingPartyID,
                        customerPartyID: data.customerPartyID,
                        statusTypeID: data.statusTypeID

                    })
                } else if (status == 'new') {
                    this.bookingBatchStore.upsert(data.bookingBatchID,{
                        batchCode: data.batchCode,
                        name: data.name,
                        description: data.description,
                        creationDate: data.creationDate,
                        bookingSlipQuantity: data.bookingSlipQuantity,
                        bookingPartyID: data.bookingPartyID,
                        customerPartyID: data.customerPartyID,
                        statusTypeID: data.statusTypeID
                    })
                }
                // send notification message that save was successfull
                this.sendNotification('Save Succesfully');

            })

    }

    // remove booking batch id in store
    removeBookingBatchStoreID(bookingBatchId: ID) {
        this.bookingBatchStore.remove(bookingBatchId);
    }

    // display message notification
    sendNotification(errMsg: string): void {
        this.notification.blank(
            'Message!',
            errMsg,
            {
                nzStyle: {
                    width: '600px',
                    marginLeft: '-265px'
                },
                nzDuration: 4500,
                nzPauseOnHover: true,
                nzAnimate: true
            }

        );
    }
    
}
