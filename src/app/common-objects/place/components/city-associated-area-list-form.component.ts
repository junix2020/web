import {
   Component,
   Input,
   OnInit,
   TemplateRef,
   ViewChild,      AfterViewInit,
      ViewContainerRef,
      HostListener,
      OnDestroy,
      ChangeDetectorRef,
      AfterViewChecked,
      Output,
      EventEmitter
} from '@angular/core';
import {
   ControlValueAccessor,
   FormBuilder,
   FormGroup,
} from '@angular/forms';
import { EmptyListComponent, PanelService } from '@web/shell';
import { isEmpty, isNil, isNotNil } from '@web/util';
import { ColDef, GridApi, GridOptions, RowNode } from 'ag-grid-community';
import * as uuid from 'uuid/v4';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { CityAssociatedAreaEventArgs } from '../../common-attributes/city-associated-area-event-args';
import { AssociatedAreaDTO } from '../dto/associated-area.dto';
import { takeUntil } from 'rxjs/operators';
import { SplitterService } from '../../../shell/services/splitter.service';
import { CityAreaCommonService } from '../services/city-area-common-service';


@Component({
   selector: 'city-associated-area-listform',
   template: `
<!--	 <pre>{{listOfData | json }}</pre> -->
  <div class="test-container">
  <!--    <div class="test-header">Selection: <span id="selectedRows"></span></div> -->
   
      <ag-grid-angular
            #agGridAssociatedArea
            id="associatedGrid"
            class="ag-theme-balham"
            rowSelection='single'
            [rowData]="associatedAreaData"
            [columnDefs]="columnDefs"
            [colResizeDefault]="colResizeDefault"
            [defaultColDef]="defaultColDef"
            (displayedColumnsChanged)="onDisplayedColumnsChanged($event)"
            [rowHeight]="32"
            [editType]="editType"
            (rowClicked)='onRowClicked($event)'
            (cellClicked)='onCellClicked($event)'
           (gridReady)="onGridReady($event)"
         >
       </ag-grid-angular>
</div>
      <div class="action-bar">
         <button
            nz-button
            nzType="danger"
            [disabled]="isRemove"
            (click)="onRemove()"
         >
            Remove
         </button>
         <button nz-button nzType="primary" [disabled]="isAdd" (click)="onShowAdd()">
            Add
         </button>
      </div>
   `,
   styles: []
   
})
export class CityAssociatedAreaListFormComponent implements OnInit, AfterViewInit, OnDestroy {
// all variables needed
   associatedAreaData: any[] =[];
   associatedArea: Array<AssociatedAreaDTO> = [];
   columnDefs: ColDef[];
   editType;
   value: any[];
   newData: any[] = []
   disabled = false;
   selectedItem: any;
   nodeData: any;
   columnId: string;
   isAdd: boolean = false;
   isRemove: boolean = false;
   sourceData: any = undefined;

// variables that receive data from the parent   
   @Input() status: string;
   @Input() areaId: string;
   @Output() deleteAreaAssociated = new EventEmitter<any>();
   @Input() isMsg: boolean;

// method to destroy the observable
   destroy$ = new Subject();

// grid column default resizable and filter
   defaultColDef: ColDef = {
      resizable: true,
      filter: true
   };

// variable to assign grid settings
   private gridApi;
   private gridColumnApi;

// variable to be set default column resize
    colResizeDefault;

// variable to store the province id
   provinceAreaId: string;

// an object to set overly empty
    frameworkComponents = {
      emptyOverlay: EmptyListComponent
   };

   constructor(
      private panelService: PanelService,
      public router: Router, public activatedRoute: ActivatedRoute,
      private fb: FormBuilder,
      public viewContainerRef: ViewContainerRef,
      private ref: ChangeDetectorRef,
      private splitterService: SplitterService,
   ) {
      this.editType = "fullRow";
      this.columnDefs = [
         {
            headerName: 'Association Type', field: 'associationTypeName', cellStyle: { color: 'black', backgroundColor: 'white' },
            editable: true, cellEditor: 'agSelectCellEditor',
            cellEditorParams: () => {
               var associationType = this.associationTypes();
               return {
                  values: associationType.map(a => a.associationTypeName)
               }
            }

         },
         { headerName: 'Code', editable: false, field: 'areaCode', sortable: true },
         { headerName: 'Name', field: 'areaName', editable: false },
         { headerName: 'Description', editable: false, field: 'areaDescription' },
         { headerName: 'Status', editable: false, field: 'areaStatusName' },
         { headerName: 'Area Associated ID', field: 'areaAssociationID', hide: true },
         { headerName: 'Association Type ID', field: 'associationTypeID', hide: true },
         { headerName: 'Area ID', field: 'areaID', hide: true }
      ];

   }

// method to return assoiciation types
   associationTypes() {
      var items = [
         { associationTypeName: 'Subsidiary Association Type' },
         { associationTypeName: 'Adjacent Association Type' }
      ];
      return items;
   }

// method to initialize the associated area to empty
   createInitialAssociatedArea() {
      // check associated area form array if there is existing record before inserting // && this.gridApi
      var newItem: any;
         newItem = this.associatedAreaEmpty();
         var res = this.gridApi.updateRowData({
            add: [newItem]
         });
   }

// method to call to update the display of columns   
   onDisplayedColumnsChanged(params) {
      params.api.sizeColumnsToFit();
      this.colResizeDefault = "shift";
   }

// method to call associated area to empty
   associatedAreaEmpty() {
      var newData: any;
      newData = {
         areaAssociationID: '',
         associationTypeID: '',
         associationTypeName: '',
         areaID: '',
         areaCode: '',
         areaName: '',
         areaDescription: '',
         areaStatusName: ''
      }
      return newData;
   }

// method to get the data in a form of an event
   onRowClicked(event: any) {
      this.nodeData = event;
      
      this.nodeData = { ...this.nodeData, columnId: this.columnId };
   }

// method to call to get current column id
   onCellClicked(event: any) {
      this.columnId = event.column.colId;
       this.activateButton();
   }

// method to activate the button
    activateButton() {
        if (this.status.toLowerCase() == 'edit' || this.status.toLowerCase() == 'new') {
            if (this.columnId == 'areaName') {
                this.isAdd = false;
                this.isRemove = true;
            } else if (this.columnId != 'areaName') {
                this.isAdd = true;
                this.isRemove = false;
            }
        } else if (this.status.toLowerCase() == 'view') {  // else disable the button
            this.isAdd = true;
            this.isRemove = true;
        }
    }

// method to activate the button and splitter subscribe     
   ngOnInit() {
       this.activateButton();
       this.splitterService.mouseUp$.pipe(
         takeUntil(this.destroy$))
         .subscribe(() => this.reSize());
   }

// method to resize the grid
   reSize() {
      this.gridApi.sizeColumnsToFit();
   }
   
   ngAfterViewInit() {

   }
   
// method to set data into the grid  
   setGridData(params) {
      this.associatedArea = params;
      try {
      // add new items here if ag-grid already loaded
         this.addItems();
         return;
      } catch (e) {
         // else use the onGridReady
      }
      
   }

// method to add or insert item(s) into grid
    addItems() {
        var i: number = 0;
        var newItem: any;

      // clear the ag-grid row first before inserting
      this.gridApi.setRowData([]);

       if(this.associatedArea.length > 0 && this.gridApi) {
          this.associatedArea.map(a => {
            newItem =
               {
                  associationTypeName: a.associationTypeName,
                  areaCode: a.areaCode,
                  areaName: a.areaName,
                  areaDescription: a.areaDescription,
                  areaStatusName: a.areaStatusName,
                  areaAssociationID: a.areaAssociationID,
                  associationTypeID: a.associationTypeID,
                  areaID: a.areaID
               };
              // add items to ag-grid
              if (newItem.areaAssociationID != null) {
                this.gridApi.updateRowData({
                    add: [newItem],
                    addIndex: i
                });
                    i++
              }
          });

       }
       this.ref.detectChanges();
       // add new row at end
       this.createInitialAssociatedArea();
    }

// a decorator to listen the window event
   @HostListener('window:resize')
   onResize() {
      if (!this.gridApi) return;

      setTimeout(() => {
         this.gridApi.sizeColumnsToFit();
      });
   }

// method to represent when grid is ready
    onGridReady(params) {
        var id = this.provinceAreaId;
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

      // add items to ag-grid
        this.addItems();

        if (id != null) {
            this.selectId(id);  // highlight the previous selected row
            this.onRemove();  // call this method to remove the highlighted row
        }

        // reset province area id to null;
        this.provinceAreaId = null;
     
    }

// method to remove selected row(s)
    onRemove() {
      try {
         var selectedRows = this.gridApi.getSelectedRows();
         this.deleteAreaAssociated.emit(selectedRows);
         this.gridApi.updateRowData({ remove: selectedRows });
      } catch (e) {

      }

    }

    // method to find the id in grid then set the highlight
    selectId(id: any) {
        this.gridApi.forEachNode(function(node) {
            if (node.data.areaID === id) {
                node.setSelected(true);
            }
        });
    }

// method to call the area assoicaited area picklist
   onShowAdd() {
      this.onCityAssociatedAreaPickList();
   }

// method to navigate the picklist
   onCityAssociatedAreaPickList() {
      var associationTypeID: string;
      this.gridApi.stopEditing();
      
      switch (this.nodeData.data.associationTypeName) {
         case 'Subsidiary Association Type':          // barangay picklist
              associationTypeID = '2160dcca-eb32-4ea6-a161-f5b9f7d83f42';
              if (this.status.toLowerCase() == 'edit' || this.status.toLowerCase() == 'view') {
                  this.router.navigateByUrl('/common-objects/place/area/political-area/city/city-associated-area-barangay-picklist', { state: { associationType: this.nodeData.data.associationTypeName, associationTypeID: associationTypeID } }); 
              } else {
                this.router.navigateByUrl('/common-objects/place/area/political-area/city/city-associated-area-barangay-picklist', { state: { associationType: this.nodeData.data.associationTypeName, associationTypeID: associationTypeID } });
              }
               break;
         case 'Adjacent Association Type':            // city picklist
              associationTypeID = '4fccd476-8828-4dac-9a40-8ec33ae815c9';
              if (this.status.toLowerCase() == 'edit' || this.status.toLowerCase() == 'view') {
                  this.router.navigateByUrl('/common-objects/place/area/political-area/city/city-associated-area-city-picklist', { state: { associationType: this.nodeData.data.associationTypeName, associationTypeID: associationTypeID } }); 
              } else {
                this.router.navigateByUrl('/common-objects/place/area/political-area/city/city-associated-area-city-picklist', { state: { associationType: this.nodeData.data.associationTypeName, associationTypeID: associationTypeID } });
              }
                break;
         default: // nothing happend if association type not selected
            return;
            break;
      }
      
   }

// method to destroy the observable
   ngOnDestroy() {
      this.destroy$.next();
      this.destroy$.complete();
            
   }
}
