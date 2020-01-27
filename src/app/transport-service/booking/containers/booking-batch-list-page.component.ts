import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { BookingBatchDTO } from '../dto/booking-batch.dto';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { BookingBatchStore } from '../state/booking-batch.store';
import { BookingBatchQuery } from '../state/booking-batch.query';
import { HttpClient } from '@angular/common/http';
import { BookingBatchService } from '../services/booking-batch.service';
import { filter, map, takeUntil } from 'rxjs/operators';
import { BookingBatchCommonService } from '../services/booking-batch-common-service';
import { BookingBatchListComponent } from '../components/booking-batch-list.component';
import { OnToolbarItemClick, Toolbar, ToolbarItemType, bookingBatchListFormToolbars, ToolbarType } from '../../../shell';
import { navigateUp } from '../../../util/navigateUp';


@Component({
    selector: 'app-booking-batch-list-page',
    template: `
<!-- <pre>{{ state$ | async | json }} </pre> -->
 <div class="booking-batch-list-page">
      <nz-collapse>
         <nz-collapse-panel
            nzHeader="Booking Batch"
            [nzDisabled]="false"
            [nzActive]="true"
            [nzShowArrow]="false">
          <ng-container *ngIf="(bookingBatches$ | async) as bookingBatches"> 

              <section [class.hide]="loading$ | async"> 
                     <app-booking-batch-list
                           [bookingBatches]="bookingBatches"
                           [bookingBatchId]="bookingBatchID"
                           (enableDelete)="onEnableDelete()"
                           (disableDelete)="onDisableDelete()"
                           (enableViewEdit)="onEnableViewEdit()"
                           (disableViewEdit)="onDisableViewEdit()"
                      >
                      </app-booking-batch-list>
              </section> 
            </ng-container> 
         </nz-collapse-panel>
      </nz-collapse>
</div>
   `
})
export class BookingBatchListPageComponent
    implements OnInit, OnDestroy, OnToolbarItemClick, AfterViewInit {
    destroy$ = new Subject();
    loading$: Observable<boolean>;
    bookingBatches$: Observable<BookingBatchDTO[]>;
    state$: Observable<object>;
    sourceData: any;
    bookingBatchID: string
    activity: string;

    batches: any[];
    
    @ViewChild(BookingBatchListComponent, { static: false }) bookingBatchListComponent: BookingBatchListComponent;

    constructor(
        private modal: NzModalService,
        private message: NzMessageService,
        private toolbar: Toolbar,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private ref: ChangeDetectorRef,
        private bookingBatchStore: BookingBatchStore,
        private bookingBatchQuery: BookingBatchQuery,
        private http: HttpClient,
        private bookingBatchService: BookingBatchService,
        private bookingBatchCommonService: BookingBatchCommonService
    ) { }

    // method to call the service and get all cities from the server
    getBookingBatches() {
        this.bookingBatches$ = this.bookingBatchService.getBookingBatches();
        this.loading$ = this.bookingBatchQuery.selectLoading();
    }


    ngOnInit() {
        // check and execute a query against the store if data already exist, 
        // and used the store as a source of data after retrieving from the server
        if (this.bookingBatchQuery.getAll().length > 0) {
            this.bookingBatches$ = this.bookingBatchQuery.selectAll();

        } else { // call the method to retrieve all data the from server
            this.getBookingBatches();
         }

        // ---- for state object --------------------------------------------//
        this.state$ = this.router.events.pipe(
            filter(e => e instanceof NavigationStart),
            map(() => {
                const currentNav = this.router.getCurrentNavigation();
                return currentNav.extras.state;
            })
        );
        this.state$ = this.activatedRoute.paramMap.pipe(
            map(() => window.history.state)
        );
        this.state$.subscribe(s => {
            this.sourceData = s;

        })
        // ----------------------------------------------------------------//
        // assign current booking batch id from the service
        if (this.getBookingBatchId() != null) {
            this.bookingBatchID = this.getBookingBatchId();
        } else {
            this.bookingBatchID = null;
        }

        this.ref.detectChanges();

        // activate toolbar items
        this.toolbar.clicked$
            .pipe(takeUntil(this.destroy$))
            .subscribe(type => this.onToolbarItemClicked(type));
        this.toolbar.load(...bookingBatchListFormToolbars());

    }

    // method to get the current booking batch id
    getBookingBatchId(): string {
        var bookingBatchId: string;
        this.bookingBatchCommonService.bookingBatch$.subscribe(b => {
            bookingBatchId = b.bookingBatchID;
        })
        return bookingBatchId;
    }

    ngAfterViewInit() {
        // make sure the flag was reset to false value, the flag was used to clear the new form and and execute the addCityEntry method once.
        this.bookingBatchCommonService.setNewBookingBatchFlag({ flag: false });  // default/reset flag to false and new booking batch will refer this flag
        this.bookingBatchCommonService.setBookingBatchId({ bookingBatchID: null }); // default/reset booking batch id to null

    }

    // toolbar services
    onToolbarItemClicked(type: ToolbarItemType) {
        var data = [];
        var bookingBatchId: string;
        switch (type) {
            case ToolbarType.bookingBatchListNew:
                var status = 'New';
                // set the current status to view in service
                this.bookingBatchCommonService.setStatus({ status: status });
                this.bookingBatchCommonService.setNewBookingBatchFlag({ flag: false });
                this.router.navigate([status.toLowerCase()], { relativeTo: this.activatedRoute });
                break;

            case ToolbarType.bookingBatchListClose:
                navigateUp(this.router);
                break;
            case ToolbarType.bookingBatchListEdit:
                var status = 'Edit';
                data = this.bookingBatchListComponent.getSelectedRow();   // call booking batch list method to get the selected row
                if (data.length > 0) {
                    data.map(d => {
                        bookingBatchId = d.bookingBatchID;
                    })
                    // set booking batch id use for list, component and treeview reference
                    this.bookingBatchCommonService.setBookingBatchId({ bookingBatchID: bookingBatchId });
                    // set the service to current status to edit
                    this.bookingBatchCommonService.setStatus({ status: status });
                    this.bookingBatchCommonService.setNewBookingBatchFlag({ flag: false });
                    this.router.navigateByUrl('/transport-service/booking/booking-batch/' + status.toLowerCase() + '/' + bookingBatchId);
                }
                break;
            case ToolbarType.bookingBatchListView:
                var status = 'View';
                data = this.bookingBatchListComponent.getSelectedRow();  // call booking batch list method to get the selected row
                if (data.length > 0) {
                    data.map(d => {
                        bookingBatchId = d.bookingBatchID;
                    })
                    // set booking batch id use for list and treeview reference
                    this.bookingBatchCommonService.setBookingBatchId({ bookingBatchID: bookingBatchId });
                    // set the current status to view
                    this.bookingBatchCommonService.setStatus({ status: status });
                    this.bookingBatchCommonService.setNewBookingBatchFlag({ flag: false });
                    this.router.navigateByUrl('/transport-service/booking/booking-batch/' + status.toLowerCase() + '/' + bookingBatchId);
                  
                }
                break;
            case ToolbarType.bookingBatchListDelete:
                this.bookingBatchListComponent.onDeleteBookingBatch();   // call booking batch list component method to delete booking batch
                break;
            case ToolbarType.bookingBatchListColumns:
                this.bookingBatchListComponent.openShowColDialog();  // call city list component method to open a dialog box to set visible or hide the column
                break;
            case ToolbarType.bookingBatchListRefresh:
                this.bookingBatchStore.remove();   // remove all data in store
                this.bookingBatchService.getBookingBatches();  // retrieve all booking batch data from the server
                this.getBookingBatches(); // method to call the retrieved data from the server
                break;
            default:
                break;

        }
    }

    // enable toolbar delete
    onEnableDelete() {
        this.toolbar.enable(ToolbarType.bookingBatchListDelete);
    }

    // disable toolbar delete
    onDisableDelete() {
        this.toolbar.disable(ToolbarType.bookingBatchListDelete);
    }

    // enable toolbar view/edit
    onEnableViewEdit() {
        this.toolbar.enable(ToolbarType.bookingBatchListView, ToolbarType.bookingBatchListEdit);
    }

    // disable view edit
    onDisableViewEdit() {
        this.toolbar.disable(ToolbarType.bookingBatchListView, ToolbarType.bookingBatchListEdit);
    }

    ngOnDestroy() {
        this.destroy$.next();  // destroy observable that was subscribed
        this.destroy$.complete();
    }

}
