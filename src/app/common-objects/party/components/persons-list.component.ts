import { OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectorRef, HostListener, Component, ChangeDetectionStrategy } from '@angular/core';
import { PersonsListDTO } from '../dtos/persons-list.dto';
import { colSource, colTarget } from '../../common-attributes/hide-unhide';
import { Subject } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd';
import { PersonsListStore } from '../states/persons-list.store';
import { PersonsListQuery } from '../states/persons-list.query';
import { SplitterService } from '../../../shell';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { ID } from '@datorama/akita';
import { PartiesService } from '../services/parties.service';
import { PartiesCommonService } from '../services/parties-common.service';
import { PartiesListShowHiddenComponent } from './parties-list-show-hidden.component';

@Component({
  selector: 'app-persons-list',
  template: `
    <div style="display: flex; flex-direction: row">
      <div style=" overflow: hidden; flex-grow: 1">
        <ag-grid-angular
          #agGrid
          id="personsList"
          class="ag-theme-balham"
          rowSelection="multiple"
          [colResizeDefault]="colResizeDefault"
          [rowHeight]="32"
          [rowData]="persons"
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

export class PersonsListComponent implements OnInit, OnDestroy {
  // variables that received data from the parent
  @Input() persons: PersonsListDTO[];
  @Input() partyId: string;
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
  selectedItems: PersonsListDTO[];

  // an event to trigger the method of the parent component
  @Output() enableDelete = new EventEmitter();
  @Output() disableDelete = new EventEmitter();
  @Output() enableViewEdit = new EventEmitter();
  @Output() disableViewEdit = new EventEmitter();


  constructor(
    private modalService: NzModalService,
    private partiesService: PartiesService,
    private partiesCommonService: PartiesCommonService,
    private store: PersonsListStore,
    private personsListQuery: PersonsListQuery,
    private splitterService: SplitterService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private ref: ChangeDetectorRef
  ) {
    gridOptions: {
      this.columnDefs = [
        { headerName: 'Party ID', field: 'partyID', hide: true },
        { headerName: 'Code', field: 'code', hide: false },
        { headerName: 'Display Name', field: 'name', hide: false },
        { headerName: 'Description', field: 'description', hide: false },
        { headerName: 'First Name', field: 'firstName', hide: false },
        { headerName: 'Last Name', field: 'lastName', hide: false },
        { headerName: 'Status', field: 'status', hide: false },
        { headerName: 'StatusTypeID', field: 'statusTypeID', hide: true },
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
  onDeleteParty(): void {
    this.partiesService.deletePartyByIDs(this.selectedItems.map(p => p.partyID), 'person')
    this.onRemoveSelected();
  }

  // method to detect selection change to enable/disable toolbar
  onSelectionChanged(persons: PersonsListDTO[]) {
    this.selectedItems = persons;

    const hasNonDrafts =
      this.selectedItems.findIndex(i => i.status !== 'Draft') >= 0;

    if (hasNonDrafts) {
      this.disableDelete.emit();

    } else {
      this.enableDelete.emit();
    }
    if (persons.length === 1) {
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
    this.persons = [];
    this.personsListQuery.selectAll().subscribe(data => {
      this.persons = data;
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
    } catch (e) { }
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
    var id = this.partyId;
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    params.api.sizeColumnsToFit();

    params.api.sizeColumnsToFit();

    window.addEventListener('resize', function () {
      setTimeout(function () {
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
    this.gridApi.forEachNode(function (node) {
      if (node.data.partyID === id) {
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
      nzContent: PartiesListShowHiddenComponent,
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
