import { Component, ChangeDetectionStrategy, OnInit, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { filter, map, takeUntil } from 'rxjs/operators';
import { CityAssociatedAreaProvinceDTO } from '../dto/city-associated-area-province-picklist.dto';
import { CityAreaCommonService } from '../services/city-area-common-service';
import { SplitterService } from '../../../shell/services/splitter.service';



@Component({
   selector: 'city-associated-area-province-picklist',
   template: `
 <!-- <pre>{{ state$ | async | json }} </pre> -->
         <ag-grid-angular
           class="ag-theme-balham"
           rowSelection="single"
           colResizeDefault="shift"
           [suppressCellSelection]="true"
           [rowHeight]="32"
           [rowData]="provinces"
           [columnDefs]="columns"
           [defaultColDef]="defaultColumn"
           (gridReady)="onGridReady($event)"
           (rowDoubleClicked)="onDoubleClick($event.data)">
        </ag-grid-angular>
         <div class="action-bar">
            <button nz-button nzType="default" (click)="onCancel()">Cancel</button>
            <button nz-button nzType="default" (click)="onSelect()">Select</button>
         </div>
  `,
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class CityAssociatedAreaProvincePickListComponent implements OnInit {
// a variable the receive input from the parent
    @Input() provinces: CityAssociatedAreaProvinceDTO[];

// a variable that where url state was stored
    state$: Observable<any>;

// a variable where a subscribe data from state$ are stored
    sourceData: any;

// a variable to set column grid setting
   defaultColumn = {
      resizable: true,
      filter: true
    };

// a variable to store the state like New, Edit and View
    status: string;

// a variable to be  use to destroy an observable
    destroy$ = new Subject();

// a variable to store the id
    areaId: string;

// a variable to store the grid column resize default
    colResizeDefault;

// a variables to be use in grid settings
    gridApi;
    gridColumnApi;

// column definitions
   columns = [
      { headerName: 'Area ID', field: 'areaID', hide: true },
      { headerName: 'Code', field: 'code', hide: false, sortable: true },
      { headerName: 'Name', field: 'name', hide: false, sortable: true },
      { headerName: 'Description', field: 'description', hide: false, sortable: true },
      { headerName: 'Status Type ID', field: 'statusTypeID', hide: true },
      { headerName: 'Status', field: 'statusName', hide: false },
   ];

    constructor(
        public router: Router,
        private cityAreaCommonService: CityAreaCommonService,
        private splitterService: SplitterService,
        public activatedRoute: ActivatedRoute) { }

// method or event that all initializations are put here
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

       // get the current status from the service
       this.status = this.getCityAreaStatus();

       // get the current area id from the service
       this.areaId = this.getCityAreaId();
   }

// method or event to destroy the observable
  ngOnDestroy() {
     this.destroy$.next();
     this.destroy$.complete();
  }

// method to get the current selected grid row
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

// cancel the selection and return to parent url
    onCancel() {
        if (this.status.toLowerCase() == 'edit' || this.status.toLowerCase() == 'view') {
            this.router.navigateByUrl('/common-objects/place/area/political-area/city/' + this.status.toLowerCase() + '/' + this.areaId, { state: { source: 'CityAssociatedAreaProvince' } });

        } else {
            this.router.navigateByUrl('/common-objects/place/area/political-area/city/' + this.status.toLowerCase());
        }
    }

// method to get the saved booking batch id
    getCityAreaId(): string {
        var areaId: string;
        this.cityAreaCommonService.cityArea$.subscribe(a => {
            areaId = a.areaID;
        })
        return areaId;
    }

// method to resize ag-grid component
    reSize() {
        this.gridApi.sizeColumnsToFit();
    }

// method to get the status from the service
    getCityAreaStatus(): string {
        var status: string;
        this.cityAreaCommonService.status$.subscribe(s => {
            status = s.status;
        })
        return status;
    }

// method to get the current selected item through double click  
   onDoubleClick(item: any) {
      this.cityAreaForm(item);
   }

// method or event  to set all initialization when grid is ready
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

// method to set the state object and return to its parent url
    cityAreaForm(item: any) {
        if (this.status.toLowerCase() == 'edit' || this.status.toLowerCase() == 'view') {
            this.router.navigateByUrl('/common-objects/place/area/political-area/city/' + this.status.toLowerCase() + '/' + this.areaId, { state: { ...item, associationType: this.sourceData.associationType, associationTypeID: this.sourceData.associationTypeID, source: 'CityAssociatedAreaProvince' } });

        } else {
            this.router.navigateByUrl('/common-objects/place/area/political-area/city/' + this.status.toLowerCase(), { state: { ...item, associationType: this.sourceData.associationType, associationTypeID: this.sourceData.associationTypeID, source: 'CityAssociatedAreaProvince' } });
        }

    }

}
