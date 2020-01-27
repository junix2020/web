import { Component, ChangeDetectionStrategy, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { CityAssociatedAreaBarangayDTO } from '../dto/city-associated-area-barangay-picklist.dto';
import { Observable, Subject } from 'rxjs';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { filter, map, takeUntil } from 'rxjs/operators';
import { CityAreaCommonService } from '../services/city-area-common-service';
import { SplitterService } from '../../../shell/services/splitter.service';

@Component({
   selector: 'city-associated-area-barangay-picklist',
   template: `
 <!-- <pre>{{ state$ | async | json }} </pre>  -->
         <ag-grid-angular
           class="ag-theme-balham"
           rowSelection="single"
           colResizeDefault="shift"
           [suppressCellSelection]="true"
           [rowHeight]="32"
           [rowData]="barangays"
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
export class CityAssociatedAreaBarangayPickListComponent implements OnInit {
// a variable the recieve data(s) from the parent
   @Input()
    barangays: CityAssociatedAreaBarangayDTO[];

// a state object variable the store history of navigating url
    state$: Observable<any>;

// a variable the store the sucribed data(s) from state object
    sourceData: any;

// a variables to set grid settings
    gridApi;
    gridColumnApi;

// a variable that initialize grid settings
   colResizeDefault;
   defaultColumn = {
      resizable: true,
      filter: true
   };

// a variable that use to destroy observable
    destroy$ = new Subject();

// a variable that store current status like New, Edit and View
    status: string;

// a variable that store current id
   areaId: string;


// a variable that initialize grid columns
   columns = [
      { headerName: 'Area ID', field: 'areaID', hide: true },
      { headerName: 'Code', field: 'code', hide: false, sortable: true },
      { headerName: 'Name', field: 'name', hide: false, sortable: true },
      { headerName: 'Description', field: 'description', hide: false, sortable: true },
      { headerName: 'Status Type ID', field: 'statusTypeID', hide: true },
      { headerName: 'Status', field: 'statusName', hide: false },
   ];

// a variable that set grid settings
   columnsApi: any;

    constructor(
        public router: Router,
        private cityAreaCommonService: CityAreaCommonService,
        private splitterService: SplitterService,
        public activatedRoute: ActivatedRoute) { }

// method or event that all initializations are put in here
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

        // get the current status from the service like Edit or View
        this.status = this.getCityAreaStatus();

        // get the current area id from the service
        this.areaId = this.getCityAreaId();

    }

// method to cancel selection of item in grid and return to parent url
    onCancel() {
        if (this.status.toLowerCase() == 'edit' || this.status.toLowerCase() == 'view') {
            this.router.navigateByUrl('/common-objects/place/area/political-area/city/' + this.status.toLowerCase() + '/' + this.areaId, { state: { source: 'AssociatedArea' } });
       

        } else {
            this.router.navigateByUrl('/common-objects/place/area/political-area/city/' + this.status.toLowerCase());
        }
    }

// method to select current grid item and return to parent url
   onSelect() {
      var selectedRows = []
      var data = {};
      selectedRows = this.gridApi.getSelectedRows();
      console.log('selectedRows ', selectedRows);
      if (selectedRows.length > 0) {
         selectedRows.map(d => {
            data = Object.assign({
               areaID: d.areaID,
               code: d.code,
               description: d.description,
               name: d.name,
               statusName: d.statusName,
               statusTypeID: d.statusTypeID
            })
         })
         this.cityAreaForm(data);
      }
   }
 
// method to resize ag-grid component
    reSize() {
        this.gridApi.sizeColumnsToFit();
    }

// method to get the saved booking batch id
    getCityAreaId(): string {
        var areaId: string;
        this.cityAreaCommonService.cityArea$.subscribe(a => {
            areaId = a.areaID;
        })
        return areaId;
    }

// method to get the status from the service
    getCityAreaStatus(): string {
        var status: string;
        this.cityAreaCommonService.status$.subscribe(s => {
            status = s.status;
        })
        return status;
    }

// net yet implemented
   onRowSelect(items: any) {

   }

// method or event that destroy observable
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();

    }

// method to select the current grid item selected using double click
   onDoubleClick(item: any) {
      this.cityAreaForm(item);
   }

// method or event that initialize when grid is ready
    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;

        params.api.sizeColumnsToFit();
        window.addEventListener("resize", function () {
            setTimeout(function () {
                params.api.sizeColumnsToFit();
            });
        });
        params.api.sizeColumnsToFit();
        this.colResizeDefault = "shift";
    }

// method to return back to parent url with state data(s)
    cityAreaForm(item: any) {
        if (this.status.toLowerCase() == 'edit' || this.status.toLowerCase() == 'view') {
            this.router.navigateByUrl('/common-objects/place/area/political-area/city/' + this.status.toLowerCase() + '/' + this.areaId, { state: { ...item, associationType: this.sourceData.associationType, associationTypeID: this.sourceData.associationTypeID, source: 'AssociatedArea' } });

        } else {
            this.router.navigateByUrl('/common-objects/place/area/political-area/city/' + this.status.toLowerCase(), { state: { ...item, associationType: this.sourceData.associationType, associationTypeID: this.sourceData.associationTypeID, source: 'AssociatedArea' } });
        }
    }
}
