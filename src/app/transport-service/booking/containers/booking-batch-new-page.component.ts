import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, AfterViewInit } from '@angular/core';
import { CityFormComponent } from '../../../common-objects/place/components/city-form.component';
import { Subject } from 'rxjs';
import { Toolbar, bookingBatchNewFormToolbars, ToolbarItemType, ToolbarType } from '../../../shell';
import { Router, ActivatedRoute } from '@angular/router';
import { BookingBatchService } from '../services/booking-batch.service';
import { takeUntil } from 'rxjs/operators';
import { BookingBatchCommonService } from '../services/booking-batch-common-service';
import { BookingBatchFormComponent } from '../components/booking-batch-form.component';


@Component({
    selector: 'app-booking-batch-new-page',
    template: `
<div class="booking-batch-new">
      <nz-collapse>
            <nz-collapse-panel 
                  nzHeader="New Booking Batch"
                  [nzDisabled]="false"
                  [nzActive]="true"
                  [nzShowArrow]="false">
                  <app-booking-batch-form
                     [status]="status"
                     [isMsg]="isMsg"
                     [isDisabled]="isDisabled"
                     (onSave)="onSave($event)"
                     (resetForm)="onEmptyForm()"
                     >
                  </app-booking-batch-form>
            </nz-collapse-panel>
      </nz-collapse>
     
 </div>
  `,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class BookingBatchNewPageComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(BookingBatchFormComponent, { static: false }) bookingBatchFormComponent: BookingBatchFormComponent;
    
    destroy$ = new Subject();
    status: string;
    isDisabled: boolean = false;
    isMsg: boolean;
    bookingBatchId: string;
    flag: boolean;

    constructor(
        private toolbar: Toolbar,
        private router: Router,
        private route: ActivatedRoute,
        private bookingBatchService: BookingBatchService,
        private bookingBatchCommonService: BookingBatchCommonService,
        private ref: ChangeDetectorRef
    ) { }

    ngOnInit() {
        //set flag to enable form
        this.isMsg = true;

        // assign default status
        this.status = 'New';
        
        this.toolbar.clicked$
            .pipe(takeUntil(this.destroy$))
            .subscribe(type => this.onToolbarItemClicked(type));
        this.toolbar.load(...bookingBatchNewFormToolbars());

    }

    ngAfterViewInit() {
        // get the current flag from serive
        this.flag = this.getFlagStatus();
        
        // set flag to clear the form and execute the booking batch reset method 
        if (!this.flag) {
            this.bookingBatchFormComponent.bookingBatchFormReset();
            this.bookingBatchCommonService.setNewBookingBatchFlag({ flag: true });
        }

    }

    onToolbarItemClicked(type: ToolbarItemType) {

        switch (type) {

            case ToolbarType.bookingBatchNewSave:
                this.bookingBatchFormComponent.saveBookingBatch();
                break;
            case ToolbarType.bookingBatchNewAdd:
                this.bookingBatchFormComponent.bookingBatchFormReset();
                break;
            case ToolbarType.bookingBatchNewClose:
                this.bookingBatchCommonService.setBookingBatchId({ bookingBatchID: this.bookingBatchId });
                const url = window.location.pathname;
                var newUrl = url.slice(0, url.search('new') - 1);
                this.router.navigateByUrl(newUrl);
                break;
        }

    }

    // method to get the retieve flag status
    getFlagStatus(): boolean {
        var flag: boolean;
        this.bookingBatchCommonService.flag$.subscribe(f => {
            flag = f.flag;
        });
        return flag;
    }
    // method to get the saved booking batch id
    getBookingBatchId(): string {
        var bookingBatchId: string;
        this.bookingBatchCommonService.bookingBatch$.subscribe(b => {
            bookingBatchId = b.bookingBatchID;
        })
        return bookingBatchId;
    }

    // method to get the status from the service
    getBookingBatchStatus(): string {
        var status: string;
        this.bookingBatchCommonService.status$.subscribe(s => {
            status = s.status;
        })
        return status;
    }

    onSave(event): void {
        this.bookingBatchId = event.bookingBatchID;
        // set a new booking batch id in the service
        this.bookingBatchCommonService.setBookingBatchId({ bookingBatchID: this.bookingBatchId });
        this.bookingBatchService.saveBookingBatch(event, this.getBookingBatchStatus().toLowerCase());
    }

    onEmptyForm() {
        this.bookingBatchFormComponent.onEmptyForm();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();

    }

}
