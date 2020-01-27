import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Inject,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import { AreaClassificationPicklistDTO } from '../dto/area-classification-picklist.dto';
import { colSource } from '../../common-attributes/hide-unhide';
import { NzModalService } from 'ng-zorro-antd';
import { Observable, Subject } from 'rxjs';
import { map, filter, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { AreClassificationFilter } from '../../common-attributes/area-classification-picklist-filter';
import { GridOptions } from 'ag-grid-community';
import { CityAreaCommonService } from '../services/city-area-common-service';
import { SplitterService } from '../../../shell/services/splitter.service';


@Component({
  selector: 'area-classification-picklist',
  template: `
 <!-- <pre>{{ state$ | async | json }}</pre> -->
   <div style="margin-bottom: 5px;">
        <a nz-dropdown nzTrigger="click" [nzDropdownMenu]="menu">
        Filter by
        <i nz-icon nzType="down"></i>
      </a>
      <nz-dropdown-menu #menu="nzDropdownMenu">
       <ul nz-menu>
        <ul>
           <li nz-menu-item (click)="onItemClick($event)" *ngFor="let menu of filterTwo; let i = index">
             {{ menu.name }}
           </li>
        </ul>
       </ul>
      </nz-dropdown-menu>
   </div>
    
   <ag-grid-angular
    class="ag-theme-balham"
    rowSelection="multiple"
    [colResizeDefault]="colResizeDefault"
    [rowHeight]="32"
    [rowData]="filterOne"
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
export class AreaClassificationPickListComponent implements OnInit, AfterViewInit, OnDestroy {
// a variable the recieve data(s) from parent component
  @Input()
  areaClassifications: any;

// an event that trigger the method of the parent component
  @Output()
  itemSelect = new EventEmitter<AreaClassificationPicklistDTO[]>();
  @Output()
  itemDoubleClick = new EventEmitter<AreaClassificationPicklistDTO>();

// a variables to set grid settings
    gridApi;
    gridColumnApi;

// a variable to set grid columnd definitiona
    defaultColDef;
    colResizeDefault;

// an array to store column definitions use in show and hide
    columnDefs: colSource[];

// an array variable to store selected items
    selectedItems: AreaClassificationPicklistDTO[];

// a variable to store state object in navigating url history
    state$: Observable<any>;

// a variable that subscribe the state object data(s)
    sourceData: any;

// a array variables to use for filter
    filterOne: Array<AreClassificationFilter> = [];
    filterTwo: Array<AreClassificationFilter> = [];

// a variable to store current status like New, Edit and View
    status: string;

// a variable to store current id
    areaId: string;

// a variable to destroy observable
  destroy$ = new Subject();

    constructor(
        private modalService: NzModalService,
        public router: Router,
        public activatedRoute: ActivatedRoute,
        private cityAreaCommonService: CityAreaCommonService,
        private splitterService: SplitterService
        ) {

   this.columnDefs =
    [
      { headerName: 'Category Type ID', field: 'categoryTypeID', hide: true },
      { headerName: 'Code', field: 'code', hide: false },
      { headerName: 'Display Name', field: 'name', hide: false },
      { headerName: 'Description', field: 'description', hide: false },
      { headerName: 'Detail Indicator', field: 'detailIndicator', hide: true },
      { headerName: 'Mutually Exclusive Indicator', field: 'mutuallyExclusiveIndicator', hide: true },
      { headerName: 'Sub Category Type ID', field: 'subCategoryTypeID', hide: true },
      { headerName: 'Sub Category Name', field: 'subCategoryName', hide: true },
    ];
      this.defaultColDef = { resizable: true, sortable: true, filter: true };
      this.colResizeDefault = "shift";

    }

// method to return selected item
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

// method to resize ag-grid component
   reSize() {
     this.gridApi.sizeColumnsToFit();
   }

// method or event that use in filtering area classifications
  ngAfterViewInit(): void {
     var classification: Array<AreClassificationFilter> = [];
     classification = this.areaClassifications;

      // get all yes detail indicator
      if (this.sourceData.subCategories.length < 1) {
          this.filterOne = classification.filter(c => c.detailIndicator == 'Y');
      } else if (this.sourceData.subCategories.length > 0) {
          this.filterOne = classification.filter(c => c.detailIndicator == 'Y');
            this.sourceData.subCategories.map(s => {
              if (s.mutuallyExclusiveIndicator == 'Y') {
                this.filterOne = this.filterOne.filter(c => c.subCategoryTypeID !== s.subCategoryTypeID);
              }
            })
      }

    // get all no detail indicator
    this.filterTwo = classification.filter(c => c.detailIndicator == 'N');
  }

// method to set displayed columns
  onDisplayedColumnsChanged(params) {
   params.api.sizeColumnsToFit();
   this.colResizeDefault = "shift";
  }

// method to cancel if nothing selected in the picklist
    onCancel() {
      if (this.status.toLowerCase() == 'edit' || this.status.toLowerCase() == 'view') {
          this.router.navigateByUrl('/common-objects/place/area/political-area/city/' + this.status.toLowerCase() + '/' + this.areaId, { state: { source: 'AreaClassification' } });

      } else {
          this.router.navigateByUrl('/common-objects/place/area/political-area/city/' + this.status.toLowerCase());
      }
    }

// method to get the current selected in the picklist
  onSelect() {
    var selectedRows = []
    var data = {};
    selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows.length > 0) {
      selectedRows.map(d => {
        data = Object.assign({
          categoryTypeID: d.categoryTypeID,
          code: d.code,
          description: d.description,
          detailIndicator: d.detailIndicator,
          mutuallyExclusiveIndicator: d.mutuallyExclusiveIndicator,
          name: d.name,
          subCategoryName: d.subCategoryName,
          subCategoryTypeID: d.subCategoryTypeID
        })
      })
      this.cityAreaForm(data, 'AreaClassification');
    }
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

// method to select the current item through click
  onItemClick(params) {
    var itemSelected = params.srcElement.firstChild.data;
    var subCategoryId: string;
    var filterInstance = this.gridApi.getFilterInstance('subCategoryTypeID');
    var model = filterInstance.getModel();
    this.filterOne.map(f => {
      if (f.subCategoryName.trim() == itemSelected.trim()) {
        subCategoryId = f.subCategoryTypeID;
      }
    })

   filterInstance.setModel({
      type: 'equals',
      filter: subCategoryId
   });
    this.gridApi.onFilterChanged();
  }

// method to select item through double clicking
  onDoubleClick(item: any) {
    var source: string;
    for (let entry of this.sourceData.subCategories) {
      if (entry.categoryTypeID == item.categoryTypeID && entry.categoryTypeID != null) {
        source = 'equal';
        item = null;
        break;
      }
    }
    if (source == 'equal') {
      source = '';
    } else {
      source = 'AreaClassification';
    }
  
    this.cityAreaForm(item, source);
  }

// method to return to parent url with state object data(s)
  cityAreaForm(item: any, source: string) {
      if (this.status.toLowerCase() == 'edit' || this.status.toLowerCase() == 'view' ) {
        this.router.navigateByUrl('/common-objects/place/area/political-area/city/' + this.status.toLowerCase() + '/' + this.areaId, { state: { ...item, source } });
      } else {
         this.router.navigateByUrl('/common-objects/place/area/political-area/city/' + this.status.toLowerCase(), { state: { ...item, source } });
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

// method to get the status from the service
   getCityAreaStatus(): string {
      var status: string;
      this.cityAreaCommonService.status$.subscribe(s => {
         status = s.status;
      })
      return status;
   }

// method or event to destroy observable
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();

  }
}
