import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { colSource } from '../../common-attributes/hide-unhide';
import { Observable, Subject } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { SplitterService } from '../../../shell';
import { filter, map, takeUntil } from 'rxjs/operators';
import { PartiesCommonService } from '../services/parties-common.service';
import { PartiesStatusListDTO } from '../dtos/parties-status-list.dto';


@Component({
  selector: 'parties-status-picklist',
  template: `
 <!-- <pre>{{ state$ | async | json }}<pre> -->
    <ag-grid-angular
      class="ag-theme-balham"
      rowSelection="single"
      [colResizeDefault]="colResizeDefault"
      [rowHeight]="32"
      [rowData]="statusTypes"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      (gridReady)="onGridReady($event)"
      (displayedColumnsChanged)="onDisplayedColumnsChanged($event)"
      (selectionChanged)="itemSelect.emit($event.api.getSelectedRows())"
      (rowDoubleClicked)="onDoubleClick()"
    >
    </ag-grid-angular>
      <div class="action-bar">
            <button nz-button nzType="default" (click)="onCancel()">Cancel</button>
            <button nz-button nzType="default" (click)="onSelect()">Select</button>
      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PartiesStatusPickListComponent implements OnInit, OnDestroy {
  // a variable that receive data(s) from parent component
  @Input()
  statusTypes: PartiesStatusListDTO[];

  // an event emitter to trigger the method of the parent component
  @Output()
  itemSelect = new EventEmitter<PartiesStatusListDTO>();
  @Output()
  itemDoubleClick = new EventEmitter<PartiesStatusListDTO>();

  // a variables to set grid settings
  gridApi;
  gridColumnApi;

  // a variable to store grid column default
  defaultColDef;
  colResizeDefault;

  // an array variable use to show and hide columns
  columnDefs: colSource[];

  // an array variables that store selected items
  selectedItems: PartiesStatusListDTO[];

  // a variable that store state object data(s) of navigating url
  state$: Observable<any>;

  // an array variable to store temporary data(s)
  data: any[] = [];

  // a variable to store current status like New, Edit and View
  status: string;

  // a variable the destroy observable
  destroy$ = new Subject();

  // a variable to store current id
  partyId: string;

  // source party name
  sourceName: string;

  constructor(
    private modalService: NzModalService,
    public router: Router,
    private partiesCommonService: PartiesCommonService,
    private splitterService: SplitterService,
    public activatedRoute: ActivatedRoute) {

    gridOptions: {
      this.columnDefs =
      [
        { headerName: 'Status Type ID', field: 'statusTypeId', hide: true },
        { headerName: 'Code', field: 'code', hide: false },
        { headerName: 'Display Name', field: 'name', hide: false },
        { headerName: 'Description', field: 'description', hide: false },
        { headerName: 'Detail Indicator', field: 'detailIndicator', hide: true },
        { headerName: 'Color ID', field: 'colorId', hide: true },
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
    
    // suscribed the mouse up event and trigger the method in the component
    this.splitterService.mouseUp$.pipe(
      takeUntil(this.destroy$))
      .subscribe(() => this.reSize());

    // get the current status from the service
    this.status = this.getPersonStatus();

    // get the current party id from the service
    this.partyId = this.getPersonsPartyId();

    // get the current source party
    this.sourceName = this.getSaveSource();
  }

  // method to get the saved booking batch id
  getPersonsPartyId(): string {
    var partyId: string;
    this.partiesCommonService.party$.subscribe(a => {
      partyId = a.partyID;
    })
    return partyId;
  }

  // method to resize ag-grid component
  reSize() {
    this.gridApi.sizeColumnsToFit();
  }

  // method to get the status from the service
  getPersonStatus(): string {
    var status: string;
    this.partiesCommonService.status$.subscribe(s => {
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
    this.partiesForm(selectedRows);
  }

  getSaveSource(): string {
    var name: string;
    this.partiesCommonService.saveSource$.subscribe(s => {
      name = s.sourceName
    })
    return name;

  }

  // method to cancel the grid selection and return to parent url
  onCancel() {
    if (this.status.toLowerCase() == 'edit' || this.status.toLowerCase() == 'view') {
      this.router.navigateByUrl('/common-objects/party/' + this.sourceName + '/' + this.status.toLowerCase() + '/' + this.partyId); //, { state: { source: 'Status' } });
    } else {
      this.router.navigateByUrl('/common-objects/party/' + this.sourceName +'/' + this.status.toLowerCase());
    }
  }

  // method or event to destroy observable
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


  // method to select current grid item through double click
  //onDoubleClick(item: any)
  onDoubleClick() {
    this.onSelect();
  }

  // method to return to parent url with state object data(s)
  partiesForm(items: any[]) {
    if (this.status == null) {
      this.status = 'New';
    }
    if (this.status.toLowerCase() == 'edit' || this.status.toLowerCase() == 'view') {
      this.router.navigateByUrl('/common-objects/party/' + this.sourceName +'/' + this.status.toLowerCase() + '/' + this.partyId, { state: { items: items, source: 'Status' } });
    } else {
      this.router.navigateByUrl('/common-objects/party/' + this.sourceName +'/' + this.status.toLowerCase(), { state: { items: items, source: 'Status' } });
    }

  }

}
