import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';
import { CityAssociatedAreaCityDTO } from '../dto/city-associated-area-city-picklist.dto';
import { Observable, Subject } from 'rxjs';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { filter, map, takeUntil } from 'rxjs/operators';
import { SplitterService } from '../../../shell/services/splitter.service';
import { CityAreaCommonService } from '../services/city-area-common-service';

@Component({
   selector: 'city-associated-area-city-picklist',
   template: `
<!-- <pre> {{ state$ | async | json }} </pre>  -->
        <ag-grid-angular
           class="ag-theme-balham"
           rowSelection="multiple"
           colResizeDefault="shift"
           [suppressCellSelection]="true"
           [rowHeight]="32"
           [rowData]="cities"
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
export class CityAssociatedAreaCityPickListComponent implements OnInit {
// a variable that recieve data(s) from the parent
   @Input()
    cities: CityAssociatedAreaCityDTO[];

// a variable that store state object history in navigation between url 
    state$: Observable<any>;

// a variable that subscribe data(s) from state object
    sourceData: any;

// a variable to set grid settings
   defaultColumn = {
      resizable: true,
      filter: true
   };

// a variable that initialize different grid columns
   columns = [
      { headerName: 'Area ID', field: 'areaID', hide: true },
      { headerName: 'Code', field: 'code', hide: false, sortable: true },
      { headerName: 'Name', field: 'name', hide: false, sortable: true },
      { headerName: 'Description', field: 'description', hide: false, sortable: true },
      { headerName: 'Status Type ID', field: 'statusTypeID', hide: true },
      { headerName: 'Status', field: 'statusName', hide: false },
   ];

// a variables that used for grid settings
    gridApi: any;
    columnsApi: any;

// a variable the destroy observable
    destroy$ = new Subject();

// a variable that store current status like New, Edit, View
    status: string;

// a variable that store current id
   areaId: string;

    constructor(
        public router: Router,
        private cityAreaCommonService: CityAreaCommonService,
        private splitterService: SplitterService,
        public activatedRoute: ActivatedRoute) { }

// method to select the current grid item and return to parent url
   onSelect() {
      var selectedRows = []
      var data = {};
      selectedRows = this.gridApi.getSelectedRows();
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

// method to cancel the selection of grid item and return to parent url
    onCancel() {
        if (this.status.toLowerCase() == 'edit' || this.status.toLowerCase() == 'view') {
            this.router.navigateByUrl('/common-objects/place/area/political-area/city/' + this.status.toLowerCase() + '/' + this.areaId, { state: { source: 'AssociatedArea' } });

        } else {
            this.router.navigateByUrl('/common-objects/place/area/political-area/city/' + this.status.toLowerCase());
        }
    }

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

// not yet implemented
   onRowSelect(items: any) {

   }

// method to get current item by using a double click
   onDoubleClick(item: any) {
      this.cityAreaForm(item);
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

// method or event that when grid is ready
    onGridReady(gridOptions: any) {
      this.gridApi = gridOptions.api;
      this.columnsApi = gridOptions.columnApi;
      this.gridApi.sizeColumnsToFit();
    }

// method or event that destroy observable
   ngOnDestroy() {
      this.destroy$.next();
      this.destroy$.complete();
   }

// method to navigate url back to parent url with state object data(s)
    cityAreaForm(item: any) {
        if (this.status.toLowerCase() == 'edit' || this.status.toLowerCase() == 'view') {
            this.router.navigateByUrl('/common-objects/place/area/political-area/city/' + this.status.toLowerCase() + '/' + this.areaId, { state: { ...item, associationType: this.sourceData.associationType, associationTypeID: this.sourceData.associationTypeID, source: 'AssociatedArea' } });

        } else {
            this.router.navigateByUrl('/common-objects/place/area/political-area/city/' + this.status.toLowerCase(), { state: { ...item, associationType: this.sourceData.associationType, associationTypeID: this.sourceData.associationTypeID, source: 'AssociatedArea' } });
        }

    }

}
