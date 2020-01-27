import { Component, ChangeDetectionStrategy, OnInit, AfterViewInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { colSource } from '../../common-attributes/hide-unhide';
import { Observable, Subject } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { SplitterService } from '../../../shell';
import { filter, map, takeUntil } from 'rxjs/operators';
import { PartiesCommonService } from '../services/parties-common.service';
import { PartiesClassificationListDTO } from '../dtos/parties-classification-list.dto';


@Component({
  selector: 'parties-classification-picklist',
  template: `
 <!-- <pre> {{ state$ | async | json }} </pre> -->
   <ag-grid-angular
    class="ag-theme-balham"
    rowSelection="multiple"
    [colResizeDefault]="colResizeDefault"
    [rowHeight]="32"
    [rowData]="classifications"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    (gridReady)="onGridReady($event)"
    (displayedColumnsChanged)="onDisplayedColumnsChanged($event)"
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
export class PartiesClassificationPicklistComponent implements OnInit, AfterViewInit, OnDestroy {
  // a variable the recieve data(s) from parent component
  @Input()
  classifications: any;

  // a variables to set grid settings
  gridApi;
  gridColumnApi;

  // a variable to set grid columnd definitiona
  defaultColDef;
  colResizeDefault;

  // an array to store column definitions use in show and hide
  columnDefs: colSource[];

  // an array variable to store selected items
  selectedItems: PartiesClassificationListDTO[];

  // a variable to store state object in navigating url history
  state$: Observable<any>;

  // a variable that subscribe the state object data(s)
  //sourceData: any;

  // a variable to store current status like New, Edit and View
  status: string;

  // a variable to store current id
  partyId: string;

  // source party name
  sourceName: string;

  // a variable to destroy observable
  destroy$ = new Subject();

  constructor(
    private modalService: NzModalService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private partiesCommonService: PartiesCommonService,
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
      ];
    this.defaultColDef = { resizable: true, sortable: true, filter: true };
    this.colResizeDefault = "shift";

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

    
    // get the current area id from the service
    this.partyId = this.getClassificationPartyId();

    // get the current source party
    this.sourceName = this.getSaveSource();

    // get the current status
    this.status = this.getPartyStatus();
  }

  // method to resize ag-grid component
  reSize() {
    this.gridApi.sizeColumnsToFit();
  }

  // method or event that use in filtering area classifications
  ngAfterViewInit(): void {
   
  }

  // method to set displayed columns
  onDisplayedColumnsChanged(params) {
    params.api.sizeColumnsToFit();
    this.colResizeDefault = "shift";
  }

  // method to cancel if nothing selected in the picklist
  onCancel() {
    if (this.status.toLowerCase() == 'edit' || this.status.toLowerCase() == 'view') {
      this.router.navigateByUrl('/common-objects/party/' + this.sourceName + '/' + this.status.toLowerCase() + '/' + this.partyId); //, { state: { source: 'AreaClassification' } });

    } else {
      this.router.navigateByUrl('/common-objects/party/' + this.sourceName + '/' + this.status.toLowerCase());
    }
  }

  // method to get the current selected in the picklist
  onSelect() {
    var selectedRows = [];
    selectedRows = this.gridApi.getSelectedRows();
     if (selectedRows.length > 0) {
      this.partyForm(selectedRows, 'Classifications');
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

  // method to select item through double clicking
  onDoubleClick() {
    this.onSelect();
  }

  // method to return to parent url with state object data(s)
  partyForm(items: any[], source: string) {
    if (this.status.toLowerCase() == 'edit' || this.status.toLowerCase() == 'view') {
      this.router.navigateByUrl('/common-objects/party/' + this.sourceName + '/' + this.status.toLowerCase() + '/' + this.partyId, { state: { items: items, source: source } });
    } else {
      this.router.navigateByUrl('/common-objects/party/' + this.sourceName + '/' + this.status.toLowerCase(), { state: { items: items, source: source } });
    }
  }

  // method to get the saved booking batch id
  getClassificationPartyId(): string {
    var partyId: string;
    this.partiesCommonService.party$.subscribe(a => {
      partyId = a.partyID;
    })
    return partyId;
  }

  getSaveSource(): string {
    var name: string;
    this.partiesCommonService.saveSource$.subscribe(s => {
      name = s.sourceName
    })
    return name;

  }

  // method to get the status from the service
  getPartyStatus(): string {
    var status: string;
    this.partiesCommonService.status$.subscribe(s => {
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
