import { ChangeDetectionStrategy, OnInit, Input, Component, Output, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { BookingBatchCustomerPartyPicklistDTO } from '../dto/booking-batch-customer-party-picklist.dto';
import { filter, map, takeUntil } from 'rxjs/operators';
import { BookingBatchCommonService } from '../services/booking-batch-common-service';
import { SplitterService } from '../../../shell/services/splitter.service';


@Component({
    selector: 'booking-batch-customer-party-picklist',
    template: `
 <!-- <pre>{{ state$ | async | json }} </pre>  -->
         <ag-grid-angular
           class="ag-theme-balham"
           rowSelection="single"
           colResizeDefault="shift"
           [suppressCellSelection]="true"
           [rowHeight]="32"
           [rowData]="customerParties"
           [columnDefs]="columns"
           [defaultColDef]="defaultColumn"
           (gridReady)="onGridReady($event)"
           (selectionChanged)="onRowSelect($event.api.getSelectedRows())"
           (rowDoubleClicked)="onDoubleClick($event.data)">
        </ag-grid-angular>
         <div class="action-bar">
            <button nz-button nzType="default" (click)="onCancel()">Cancel</button>
            <button nz-button nzType="default" (click)="onSelect()">Select</button>
         </div>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookingBatchCustomerPartyPicklistComponent implements OnInit {
    @Input()
    customerParties: BookingBatchCustomerPartyPicklistDTO[];
    state$: Observable<any>;
    sourceData: any;
    gridApi;
    defaultColumn = {
        resizable: true,
        filter: true
    };

    destroy$ = new Subject();
    
    columns = [
        { headerName: 'Party ID', field: 'partyID', hide: true },
        { headerName: 'Code', field: 'code', hide: false, sortable: true },
        { headerName: 'Name', field: 'name', hide: false, sortable: true },
        { headerName: 'Description', field: 'description', hide: false, sortable: true },
        { headerName: 'Status', field: 'statusName', hide: false },
    ];

    columnsApi: any;

    constructor(
        public router: Router,
        public activatedRoute: ActivatedRoute,
        private bookingBatchCommonService: BookingBatchCommonService,
        private splitterService: SplitterService
    ) { }

    onCancel() {
        var status = this.getBookingBatchStatus().toLowerCase();
        var bookingBatchId = this.getBookingBatchId();

        if (status == 'edit' || status == 'view') {
            this.router.navigateByUrl('/transport-service/booking/booking-batch/' + status + '/' + bookingBatchId, { state: { source: 'CustomerParty'} });
        } else if (status == 'new') {
            this.router.navigateByUrl('/transport-service/booking/booking-batch/' + status, { state: { source: 'CustomerParty' } });
        }
    }

    onSelect() {
        var selectedRows = []
        var data = {};
        selectedRows = this.gridApi.getSelectedRows();
        if (selectedRows.length > 0) {
            selectedRows.map(d => {
                data = Object.assign({
                    partyID: d.partyID,
                    code: d.code,
                    name: d.name,
                    description: d.description,
                    statusName: d.statusName,
                })
            })
        }
        this.onBookingBatchForm(data);
    }

    onBookingBatchForm(item: any) {
        var status = this.getBookingBatchStatus().toLowerCase();  // get the current status from the service
        this.onNavigate(status, item);
    }

    // navigate to each status
    onNavigate(status, item) {
        var bookingBatchId = this.getBookingBatchId(); // get the current booking batch id from the service

        if (status == 'edit' || status == 'view') {
            this.router.navigateByUrl('/transport-service/booking/booking-batch/' + status + '/' + bookingBatchId, { state: { ...item, source: 'CustomerParty' } });

        } else if (status == 'new') {
            this.router.navigateByUrl('/transport-service/booking/booking-batch/' + status, { state: { ...item, source: 'CustomerParty' } });
        }
    }

    ngOnInit() {
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

        // suscribed the mouse up event and trigger the method in the component
        this.splitterService.mouseUp$.pipe(
            takeUntil(this.destroy$))
            .subscribe(() => this.reSize());

    }

    // method to resize ag-grid component
    reSize() {
        this.gridApi.sizeColumnsToFit();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    onRowSelect(items: any) {

    }

    onDoubleClick(item: any) {
        this.onBookingBatchForm(item);
    }

    onGridReady(gridOptions: any) {
        this.gridApi = gridOptions.api;
        this.columnsApi = gridOptions.columnApi;
        this.gridApi.sizeColumnsToFit();
    }

    // method to get the current status like view, edit etc
    getBookingBatchStatus(): string {
        var status: string;
        this.bookingBatchCommonService.status$.subscribe(s => {
            status = s.status;
        })
        return status;
    }

    // method to get the current booking batch id
    getBookingBatchId(): string {
        var bookingBatchId: string;
        this.bookingBatchCommonService.bookingBatch$.subscribe(b => {
            bookingBatchId = b.bookingBatchID;
        })
        return bookingBatchId;
    }
}
