import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ID } from '@datorama/akita';
import { NzModalService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SplitterService } from '../../../shell/services/splitter.service';
import { colSource, colTarget } from '../../common-attributes/hide-unhide';
import { AreaDTO } from '../dto/area.dto';
import { CityAreasService } from '../services/city-areas.service';
import { AreasQuery } from '../state/areas.query';
import { AreasStore } from '../state/areas.store';
import { AreaShowHiddenComponent } from './area-show-hidden.component';
import { CityAreaCommonService } from '../services/city-area-common-service';

@Component({
  selector: 'app-city-list',
  template: `
    <div style="display: flex; flex-direction: row">
      <div style=" overflow: hidden; flex-grow: 1">
        <ag-grid-angular
          #agGrid
          id="cityList"
          class="ag-theme-balham"
          rowSelection="multiple"
          [colResizeDefault]="colResizeDefault"
          [rowHeight]="32"
          [rowData]="cities"
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
export class CityListComponent implements OnInit, OnDestroy {
// variables that received data from the parent
  @Input() cities: AreaDTO[];
  @Input() areaId: string;
  @Input() activity: string;

// variables to set grid property
  defaultColDef;
  colResizeDefault;

// variable to store array of columns
   columnDefs: colSource[];

// variable to store any data
  data: any;

// variables to set grid settings
  private gridApi;
  private gridColumnApi;

// a variable to destroy the observable
   destroy$ = new Subject();

// a variable to store selected items
  selectedItems: AreaDTO[];

// an event to trigger the method of the parent component
  @Output() enableDelete = new EventEmitter();
  @Output() disableDelete = new EventEmitter();
  @Output() enableViewEdit = new EventEmitter();
  @Output() disableViewEdit = new EventEmitter();


  constructor(
      private modalService: NzModalService,
      private cityAreasService: CityAreasService,
      private cityAreaCommonService: CityAreaCommonService,
      private store: AreasStore,
      private areasQuery: AreasQuery,
      private splitterService: SplitterService,
      public router: Router,
      public activatedRoute: ActivatedRoute,
      private ref: ChangeDetectorRef
  ) {
    gridOptions: {
      this.columnDefs = [
        { headerName: 'Area ID', field: 'areaID', hide: true },
        { headerName: 'Code', field: 'code', hide: false },
        { headerName: 'Display Name', field: 'name', hide: false },
        { headerName: 'Description', field: 'description', hide: false },
        { headerName: 'StatusTypeID', field: 'statusTypeID', hide: true },
        { headerName: 'Status', field: 'statusName', hide: false }
      ];
      this.defaultColDef = { resizable: true, sortable: true, filter: true };
      this.colResizeDefault = 'shift';
    }
  }

// method or event that all initializations are put here
  ngOnInit() {
    // suscribed the mouse up event and trigger the method in the component
    this.splitterService.mouseUp$
      .pipe(takeUntil(this.destroy$))
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

// method to delete the city in the list, cancel if status is active
  onDeleteCityArea(): void {

    if (this.selectedItems.length > 1) {
      this.cityAreasService.deleteCityAreaByIDs(this.selectedItems.map(a => a.areaID))
       .subscribe();
    } else {
      var areaId: string;
      this.selectedItems.map(b => {
      areaId = b.areaID;

      })
      this.cityAreasService.deleteCityAreaByID(areaId)
    }
    this.onRemoveSelected();
   
  }

// method to detect selection change to enable/disable toolbar
  onSelectionChanged(areas: AreaDTO[]) {
     this.selectedItems = areas;

     const hasNonDrafts =
     this.selectedItems.findIndex(i => i.statusName !== 'Draft') >= 0;

     if (hasNonDrafts) {
        this.disableDelete.emit();

     } else {
       this.enableDelete.emit();
     }
     if (areas.length === 1) {
       this.enableViewEdit.emit();
     } else {
       this.disableViewEdit.emit();
     }

  }

// method to remove selected row(s)
  onRemoveSelected() {
     var selectedData = this.gridApi.getSelectedRows();
     var res = this.gridApi.updateRowData({ remove: selectedData });
  }

// method to update the ag-grid list of cities
  updateCities() {
    this.cities = [];
    this.areasQuery.selectAll().subscribe(data => {
      this.cities = data;
    });
  }

// get selected row
  getSelectedRow(): any {
    var selectedData = this.gridApi.getSelectedRows();
    return selectedData;
  }

// method to update change of columns esp. set column visible and hide
  onDisplayedColumnsChanged(params) {
    try {
      this.gridApi.sizeColumnsToFit();
      this.colResizeDefault = 'shift';
    } catch (e) {}
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

// method or event to represent when grid is ready
  onGridReady(params) {
    var id = this.areaId;
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    params.api.sizeColumnsToFit();

    params.api.sizeColumnsToFit();

    window.addEventListener('resize', function() {
      setTimeout(function() {
        params.api.sizeColumnsToFit();
      });
    });
    this.colResizeDefault = 'shift';
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
    this.gridApi.forEachNode(function(node) {
      if (node.data.areaID === id) {
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
      });
    }
    const modal = this.modalService.create({
      nzContent: AreaShowHiddenComponent,
      nzComponentParams: {
        colData: targetCol,
        sourceData: this.columnDefs
      },
      nzMask: false, //prevent and disable background color not be changed
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

// method to destroy obsevable
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
