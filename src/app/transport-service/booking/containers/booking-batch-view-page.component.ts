import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BookingBatchFormComponent } from '../components/booking-batch-form.component';
import { Toolbar, ToolbarItemType, ToolbarType, bookingBatchViewFormToolbars } from '../../../shell';
import { Router, ActivatedRoute } from '@angular/router';
import { BookingBatchService } from '../services/booking-batch.service';
import { BookingBatchCommonService } from '../services/booking-batch-common-service';
import { map, takeUntil } from 'rxjs/operators';


@Component({
    selector: 'booking-batch-view-page',
    template:
        `
 <!-- <pre>{{ state$ | async | json }} </pre> -->
 <div class="booking-batch-view">
      <nz-collapse>
            <nz-collapse-panel 
                  nzHeader="View Booking Batch"
                  [nzDisabled]="false"
                  [nzActive]="true"
                  [nzShowArrow]="false">
                  <app-booking-batch-form
                     [bookingBatchId]="bookingBatchId"
                     [isMsg]="isMsg"
                     [status]="status"
                     (onSave)="onBookingBatchSave($event)"
                     (enableDelete)="onEnableDelete()"
                     (disableDelete)="onDisableDelete()"
                     (enableSave)="onEnableSave()"
                     (disableSave)="onDisableSave()"
                     (resetForm)="onEmptyForm()"
                     >
                  </app-booking-batch-form>
            </nz-collapse-panel>
      </nz-collapse>
   </div>
`
})
export class BookingBatchViewPageComponent implements OnInit, AfterViewInit, OnDestroy {
    bookingBatch$: Observable<any>;
    status: any;
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
        this.isMsg = false;

        // assign default status
        this.status = 'View'

        // get booking batch Id form the serive and assign it to property
        this.bookingBatchId = this.getBookingBatchId(); // get booking batch id from the service

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
        this.toolbar.load(...bookingBatchViewFormToolbars());

           // if flag was set to true don't retrieve again the booking batch 
        if (this.getFlagStatus()) {  
            // check if it is from picklist source customer party set toolbar save to enable
            if (this.sourceData.source != undefined || this.sourceData.source != null) {  
                    this.onEnableSave();
                    this.bookingBatchFormComponent.setDeleteToolbar();
            }
         // if flag is false do the first retrieve booking batch from the server
        } else {
                //this.bookingBatchId = this.getBookingBatchId(); // get passed booking batch id from the service
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

            case ToolbarType.bookingBatchViewEdit:
                this.isMsg = true;
                this.bookingBatchFormComponent.setEnableDisableForm(this.isMsg);
                this.onEnableSave();
                break;
            case ToolbarType.bookingBatchViewSave:
                this.bookingBatchFormComponent.saveBookingBatch();
                break;
            case ToolbarType.bookingBatchViewDelete:
                this.bookingBatchService.deleteBookingBatchByID(this.bookingBatchId);
                this.bookingBatchCommonService.setBookingBatchId({ bookingBatchID: null });
                this.bookingBatchFormComponent.bookingBatchFormReset();
                this.bookingBatchService.sendNotification('Record successfully deleted!');
                break;
            case ToolbarType.bookingBatchViewClose:
                this.bookingBatchId = this.getBookingBatchId();
                const url = window.location.pathname;
                var newUrl = url.slice(0, url.search('view') - 1);
                this.router.navigateByUrl(newUrl);
                break;
        }

    }

    // enable toolbar delete
    onEnableDelete() {
        this.toolbar.enable(ToolbarType.bookingBatchViewDelete);
    }

    // disable toolbar delete
    onDisableDelete() {
        this.toolbar.disable(ToolbarType.bookingBatchViewDelete);
    }

    // enable toolbar save
    onEnableSave() {
        this.toolbar.enable(ToolbarType.bookingBatchViewSave);
    }

    // disable toolbar save
    onDisableSave() {
        this.toolbar.disable(ToolbarType.bookingBatchViewSave);
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
