import { Component, ChangeDetectionStrategy, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AreaStatusTypeDTO } from '../dto/area-status-type-picklist.dto';
import { Observable, Subject } from 'rxjs';
import { colSource } from '../../common-attributes/hide-unhide';
import { NzModalService } from 'ng-zorro-antd';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { filter, map, takeUntil } from 'rxjs/operators';
import { AreaStatusTypePicklistStore } from '../state/area-status-type-picklist.store';
import { CityAreaCommonService } from '../services/city-area-common-service';
import { SplitterService } from '../../../shell/services/splitter.service';


@Component({
  selector: 'area-status-type-picklist',
  template: `
 <!-- <pre>{{ state$ | async | json }}<pre> -->
    <ag-grid-angular
      class="ag-theme-balham"
      rowSelection="single"
      [colResizeDefault]="colResizeDefault"
      [rowHeight]="32"
      [rowData]="areaStatusTypes"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      (gridReady)="onGridReady($event)"
      (displayedColumnsChanged)="onDisplayedColumnsChanged($event)"
      (selectionChanged)="itemSelect.emit($event.api.getSelectedRows())"
      (rowDoubleClicked)="onDoubleClick($event.data)"
    >
    </ag-grid-angular>
      <div class="action-bar">
            <button nz-button nzType="default" (click)="onCancel()">Cancel</button>
            <button nz-button nzType="default" (click)="onSelect()">Select</button>
      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AreaStatusTypeListComponent implements OnInit, OnDestroy {
// a variable that receive data(s) from parent component
  @Input()
  areaStatusTypes: AreaStatusTypeDTO[];

// an event emitter to trigger the method of the parent component
    @Output()
    itemSelect = new EventEmitter<AreaStatusTypeDTO>();
    @Output()
    itemDoubleClick = new EventEmitter<AreaStatusTypeDTO>();

// a variables to set grid settings
    gridApi;
    gridColumnApi;

// a variable to store grid column default
    defaultColDef;
    colResizeDefault;

// an array variable use to show and hide columns
    columnDefs: colSource[];

// an array variables that store selected items
    selectedItems: AreaStatusTypeDTO[];

// a variable that store state object data(s) of navigating url
    state$: Observable<any>;

// a variable that store the subscribed data(s) from the state object
    sourceData: any;

// an array variable to store temporary data(s)
    data: any[] = [];

// a variable to store current status like New, Edit and View
    status: string;

// a variable the destroy observable
    destroy$ = new Subject();

// a variable to store current id
  areaId: string;

  constructor(
      private modalService: NzModalService,
      public router: Router,
      private cityAreaCommonService: CityAreaCommonService,
      private splitterService: SplitterService,
      public activatedRoute: ActivatedRoute) {

           gridOptions: {
            this.columnDefs =
             [
               { headerName: 'Status Type AssociationID', field: 'statusTypeAssociationID', hide: true },
               { headerName: 'Association TypeID', field: 'associationTypeID', hide: true },
               { headerName: 'Subject Status TypeID', field: 'subjectStatusTypeID', hide: true },
               { headerName: 'Associated Status TypeID', field: 'associatedStatusTypeID', hide: true },
               { headerName: 'Status Name', field: 'associatedStatusTypeName', hide: false }
             ];
              this.defaultColDef = { resizable: true, sortable: true, filter: true };
              this.colResizeDefault = "shift";
           }
  }

// method to return current selected grid item
    get selectedItem() {
      return this.selectedItems[0];
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
     });

  // suscribed the mouse up event and trigger the method in the component
    this.splitterService.mouseUp$.pipe(
        takeUntil(this.destroy$))
       .subscribe(() => this.reSize());

  // get the current status from the service
      this.status = this.getCityAreaStatus();

  // get the current area id from the service
      this.areaId = this.getCityAreaId();
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

// method to set grid display columns
  onDisplayedColumnsChanged(params) {
    params.api.sizeColumnsToFit();
    this.colResizeDefault = "shift";
  }

// method or event that inilialize when grid is ready
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

// method to select the current grid item  and return to parent url
   onSelect() {
      var selectedRows = []
      var data = {};
      selectedRows = this.gridApi.getSelectedRows();
      if (selectedRows.length > 0) {
         selectedRows.map(d => {
            data = Object.assign({
               statusTypeAssociationID: d.statusTypeAssociationID,
               associationTypeID: d.associationTypeID,
               subjectStatusTypeID: d.subjectStatusTypeID,
               associatedStatusTypeID: d.associatedStatusTypeID,
               associatedStatusTypeName: d.associatedStatusTypeName
            },)
         })
         this.cityAreaForm(data);
      }
   }

// method to cancel the grid selection and return to parent url
    onCancel() {
        if (this.status.toLowerCase() == 'edit' || this.status.toLowerCase() == 'view') {
            this.router.navigateByUrl('/common-objects/place/area/political-area/city/' + this.status.toLowerCase() + '/' + this.areaId, { state: { source: 'AreaStatusType' } });
        } else {
            this.router.navigateByUrl('/common-objects/place/area/political-area/city/' + this.status.toLowerCase());
        }
    }

// method or event to destroy observable
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
 

// method to select current grid item through double click
  onDoubleClick(item: any) {
    this.cityAreaForm(item);
  }

// method to return to parent url with state object data(s)
    cityAreaForm(item: any) {
        if (this.status.toLowerCase() == 'edit' || this.status.toLowerCase() == 'view') {
            this.router.navigateByUrl('/common-objects/place/area/political-area/city/' + this.status.toLowerCase() + '/' + this.areaId, { state: { ...item, source: 'AreaStatusType' } });
        } else {
            this.router.navigateByUrl('/common-objects/place/area/political-area/city/' + this.status.toLowerCase(), { state: { ...item, source: 'AreaStatusType' } });
        }
    

    }

}
