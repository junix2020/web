import { OnInit, OnDestroy, Input, ChangeDetectionStrategy, Component, ChangeDetectorRef, HostListener, EventEmitter, Output } from '@angular/core';
import { BookingBatchDTO } from '../dto/booking-batch.dto';
import { Subject } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd';
import { BookingBatchService } from '../services/booking-batch.service';
import { BookingBatchCommonService } from '../services/booking-batch-common-service';
import { BookingBatchStore } from '../state/booking-batch.store';
import { BookingBatchQuery } from '../state/booking-batch.query';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { ID } from '@datorama/akita';
import { BookingBatchShowHiddenComponent } from './booking-batch-show-hide.component';
import { colSource, colTarget } from '../../../common-objects/common-attributes/hide-unhide';
import { SplitterService } from '../../../shell/services/splitter.service';
import * as moment from 'moment';


@Component({
    selector: 'app-booking-batch-list',
    template: `
<div style="display: flex; flex-direction: row">
   <div style=" overflow: hidden; flex-grow: 1">
      <ag-grid-angular
         #agGrid
         id="bookingBatchList"
         class="ag-theme-balham"
         rowSelection="multiple"
         [colResizeDefault]="colResizeDefault"
         [suppressCellSelection]="true"
         [rowHeight]="32"
         [rowData]="bookingBatches"
         [columnDefs]="columnDefs"
         [defaultColDef]="defaultColDef"
         (selectionChanged)="onSelectionChanged($event.api.getSelectedRows())"
         (gridReady)="onGridReady($event)"
         (displayedColumnsChanged)="onDisplayedColumnsChanged($event)"
         (rowClicked)="onRowClicked($event.data)"
         >
      </ag-grid-angular>
   </div>
</div>

  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookingBatchListComponent implements OnInit, OnDestroy {
    @Input() bookingBatches: BookingBatchDTO[];
    @Input() bookingBatchId: string;

    defaultColDef;
    colResizeDefault;
    columnDefs: colSource[];
    data: any;

    private gridApi;
    private gridColumnApi;
    destroy$ = new Subject();
    selectedItems: BookingBatchDTO[];

    @Output() enableDelete = new EventEmitter();
    @Output() disableDelete = new EventEmitter();
    @Output() enableViewEdit = new EventEmitter();
    @Output() disableViewEdit = new EventEmitter();

    constructor(private modalService: NzModalService,
        private bookingBatchService: BookingBatchService,
        private bookingBatchCommonService: BookingBatchCommonService,
        private store: BookingBatchStore,
        private bookingBatchQuery: BookingBatchQuery,
        private splitterService: SplitterService,
        public router: Router, public activatedRoute: ActivatedRoute,
        private ref: ChangeDetectorRef) {

        gridOptions: {
           this.columnDefs =
             [
                { headerName: 'BookingBatch ID', field: 'bookingBatchID', hide: true },
                { headerName: 'Batch Code', field: 'batchCode', hide: false },
                { headerName: 'Display Name', field: 'name', hide: false },
                { headerName: 'Description', field: 'description', hide: false },
               {
                   headerName: 'Creation Date', field: 'creationDate', hide: false
               },
                { headerName: 'Booking Slip Quantity', field: 'bookingSlipQuantity', hide: false },
                { headerName: 'Customer Party ID', field: 'customerPartyID', hide: true },
                { headerName: 'Customer', field: 'customer', hide: false },
                { headerName: 'Booking Party ID', field: 'bookingPartyID', hide: true },
                { headerName: 'Booking Party', field: 'bookingParty', hide: false },
                { headerName: 'StatusType ID', field: 'statusTypeID', hide: true },
                { headerName: 'Status', field: 'status', hide: false }
             ];
            this.defaultColDef = { resizable: true, sortable: true, filter: true };
            this.colResizeDefault = "shift";
        }

    }

    dateFormatter(params) {
        return moment(params.value).format('MM/DD/YYYY');
    }

    ngOnInit() {
        // suscribed the mouse up event and trigger the method in the component
        this.splitterService.mouseUp$.pipe(
            takeUntil(this.destroy$))
            .subscribe(() => this.reSize());
    }

    // method to resize ag-grid component
    reSize() {
        this.gridApi.sizeColumnsToFit();
    }

    // method to get the current event and data
    onRowClicked(event) {
        this.data = event;
    }


    // method to delete the booking batch in the list
    onDeleteBookingBatch(): void {
        if (this.selectedItems.length > 1) {
            this.bookingBatchService.deleteBookingBatchByIDs(this.selectedItems.map(a => a.bookingBatchID))
                .subscribe();
        } else {
            var bookingBatchId: string;
            this.selectedItems.map(b => {
                bookingBatchId = b.bookingBatchID;
         
            })
            this.bookingBatchService.deleteBookingBatchByID(bookingBatchId)
        }
        this.onRemoveSelected();
    }

    // detect selection change to enable/disable toolbar
    onSelectionChanged(bookingBatches: BookingBatchDTO[]) {
        this.selectedItems = bookingBatches;

        const hasNonDrafts =
            this.selectedItems.findIndex(i => i.status !== 'Draft') >= 0;

        if (hasNonDrafts) {
           this.disableDelete.emit();
            
        } else {
            this.enableDelete.emit();
        }
        if (bookingBatches.length === 1) {
            this.enableViewEdit.emit();

        } else {
            this.disableViewEdit.emit();

        }
   
    }

    onRemoveSelected() {
        var selectedData = this.gridApi.getSelectedRows();
        var res = this.gridApi.updateRowData({ remove: selectedData });
    }
    
    // get selected row
    getSelectedRow(): any {
        var selectedData = this.gridApi.getSelectedRows();
        return selectedData;
    }

    // method to update change of columns esp set column visible and hide
    onDisplayedColumnsChanged(params) {
        try {
            this.gridApi.sizeColumnsToFit();
            this.colResizeDefault = "shift";
        } catch (e) {

        }
    }

    // host to listen the window resize
    @HostListener('window:resize')
    onResize() {
        if (!this.gridApi) return;

        setTimeout(() => {
            this.gridApi.sizeColumnsToFit();
        });
    }

    // method to delete selected row
    deleteSelectedRow() {
        var selectedData = this.gridApi.getSelectedRows();
        this.gridApi.updateRowData({ remove: selectedData });
    }


    // method to clear all ag-grid rows
    clearRow() {
        this.gridApi.setRowData([]);
    }

    // an ag-grid method to represent when grid is ready
    onGridReady(params) {
        var id = this.bookingBatchId;
        console.log('booking batchid grid ready ', id);
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;

        params.api.sizeColumnsToFit();

        params.api.sizeColumnsToFit();

        window.addEventListener("resize", function () {
            setTimeout(function () {
                params.api.sizeColumnsToFit();
            });
        });
        this.colResizeDefault = "shift";

        if (id != null) {
            this.selectId(id);  // highlight the previous selected row
        }
    }

    // method to remove an id in a store
    removeId(id: ID) {
        this.store.remove(id);
    }

    // method to find the id in grid then set the highlight 
    selectId(id: any) {
        this.gridApi.forEachNode(function (node) {
            if (node.data.bookingBatchID === id) {
                node.setSelected(true);
            }
        });
    }

    // method to call a dialog to set column visible or hide
    openShowColDialog() {

        if (this.columnDefs.length > 0) {
            var colData = new colTarget();
            var targetCol = [];
            this.columnDefs.map(c => {
                colData.label = c.headerName;
                colData.value = c.field;
                colData.checked = c.hide ? false : true;
                targetCol.push(Object.assign({}, colData));
            })
        }
        const modal = this.modalService.create({
            nzContent: BookingBatchShowHiddenComponent,
            nzComponentParams: {
                colData: targetCol,
                sourceData: this.columnDefs
            },
            nzMask: false,   //prevent and disable background color not be changed
            nzClosable: false,
            nzMaskClosable: false,
            nzFooter: null
        });
        //return a result when closed
        modal.afterClose.subscribe(result => {
            this.columnDefs = result;
            this.gridApi.setColumnDefs(this.columnDefs);
        });
    }

    // method to destroy all subscribed
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
