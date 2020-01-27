import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BookingBatchFormComponent } from '../components/booking-batch-form.component';
import { Toolbar, bookingBatchEditFormToolbars, ToolbarItemType, ToolbarType } from '../../../shell';
import { Router, ActivatedRoute } from '@angular/router';
import { BookingBatchService } from '../services/booking-batch.service';
import { BookingBatchCommonService } from '../services/booking-batch-common-service';
import { map, takeUntil } from 'rxjs/operators';


@Component({
    selector: 'booking-batch-edit-page',
    template:
        `
 <!-- <pre>{{ state$ | async | json }} </pre> -->
 <div class="booking-batch-edit">
      <nz-collapse>
            <nz-collapse-panel 
                  nzHeader="Edit Booking Batch"
                  [nzDisabled]="false"
                  [nzActive]="true"
                  [nzShowArrow]="false">
                  <app-booking-batch-form
                     [bookingBatchId]="bookingBatchId"
                     [status]="status"
                     [isMsg]="isMsg"
                     (onSave)="onBookingBatchSave($event)"
                     (enableDelete)="onEnableDelete()"
                     (disableDelete)="onDisableDelete()"
                     (resetForm)="onEmptyForm()"
                     >
                  </app-booking-batch-form>
            </nz-collapse-panel>
      </nz-collapse>
   </div>
`
})
export class BookingBatchEditPageComponent implements OnInit, AfterViewInit, OnDestroy {
    bookingBatch$: Observable<any>;
    status: string;
    bookingBatchId: string;
    state$: Observable<object>;
    sourceData: any;
    isMsg: boolean;

    destroy$ = new Subject();
    @ViewChild(BookingBatchFormComponent, { static: false }) bookingBatchFormComponent: BookingBatchFormComponent;
   
    constructor(
        private toolbar: Toolbar,
        private router: Router,
        private bookingBatchService: BookingBatchService,
        private bookingBatchCommonService: BookingBatchCommonService,
        public activatedRoute: ActivatedRoute,
        private ref: ChangeDetectorRef
    ) {

    }

    ngOnInit() {
        //set flag to enable form
        this.isMsg = true;

        // assign default status
        this.status = 'Edit'    

        this.state$ = this.activatedRoute.paramMap.pipe(
            map(() => window.history.state)
        );
        this.state$.subscribe(s => {
            this.sourceData = s;

        })

        // subscribe toolbar item
        this.toolbar.clicked$
            .pipe(takeUntil(this.destroy$))
            .subscribe(type => this.onToolbarItemClicked(type));
        this.toolbar.load(...bookingBatchEditFormToolbars());

        // if flag was set to true don't retrieve again the booking batch 
        if (this.getFlagStatus()) {
            this.bookingBatchId = this.getBookingBatchId()  // get booking batch id from the service
            // check if it is from picklist source customer party set delete toolbar to enable or disable
            if (this.sourceData.source != undefined || this.sourceData.source != null) {
                this.bookingBatchFormComponent.setDeleteToolbar();
            }

        // if flag is false retieve once the booking batch from the server
        } else {
            this.bookingBatchId = this.getBookingBatchId(); // get current booking batch id from the service
            this.bookingBatch$ = this.bookingBatchService.getBookingBatchByID(this.bookingBatchId); // call the service to retrieve data from server
            // subscribe the the booking batch then set the result to display in the form
            this.bookingBatch$.subscribe(res => {
                this.bookingBatchFormComponent.setResults(res);
            })

            // set flag to true to indicate data should be retrieved once
            this.bookingBatchCommonService.setNewBookingBatchFlag({ flag: true });
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

    ngAfterViewInit() {

    }

    // method use for Edit
    onBookingBatchSave(event): void {
        this.bookingBatchService.saveBookingBatch(event, this.getBookingBatchStatus().toLowerCase());
    }

    // toolbar type selections
    onToolbarItemClicked(type: ToolbarItemType) {
     
        switch (type) {

            case ToolbarType.bookingBatchEditNew:
                var status = 'New';
                // set the current status to view
                this.bookingBatchCommonService.setStatus({ status: status });
                this.bookingBatchCommonService.setNewBookingBatchFlag({ flag: false });
                this.router.navigateByUrl('/transport-service/booking/booking-batch/' + status.toLowerCase());
                break;

            case ToolbarType.bookingBatchEditSave:
                this.bookingBatchFormComponent.saveBookingBatch();
                break;
            case ToolbarType.bookingBatchEditDelete:
                this.bookingBatchCommonService.setBookingBatchId({ bookingBatchID: null });
                this.bookingBatchFormComponent.bookingBatchFormReset();
                this.bookingBatchService.sendNotification('Record successfully deleted!');
                break;

            case ToolbarType.bookingBatchEditClose:
                this.bookingBatchId = this.getBookingBatchId();
                const url = window.location.pathname;
                var newUrl = url.slice(0, url.search('edit') - 1);
                this.router.navigateByUrl(newUrl);
                break;
        }

    }

    // enable delete toolbar if status is draft
    onEnableDelete() {
        this.toolbar.enable(ToolbarType.bookingBatchEditDelete);
    }

    // disable delete toolbar if status is active 
    onDisableDelete() {
        this.toolbar.disable(ToolbarType.bookingBatchEditDelete);
    }

    // empty the form if delete toolbar was clicked
    onEmptyForm() {
        this.bookingBatchFormComponent.onEmptyForm();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
