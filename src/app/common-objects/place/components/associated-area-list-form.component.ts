import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { EmptyListComponent, PanelService } from '@web/shell';
import { isEmpty } from '@web/util';
import { ColDef, GridApi, GridOptions } from 'ag-grid-community';
import * as uuid from 'uuid/v4';

@Component({
  selector: 'app-associated-area-list-form',
  template: `
    <ng-template #formTemplate>
      <nz-collapse>
        <nz-collapse-panel
          nzHeader="Associated Area"
          [nzActive]="true"
          [nzShowArrow]="false"
        >
          <nz-form-item nz-form [nzNoColon]="true" [formGroup]="form">
            <nz-form-item>
              <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="associationType">
                Association Type
              </nz-form-label>
              <nz-form-control [nzSm]="16" [nzXs]="24">
                <nz-select formControlName="associationType">
                  <nz-option
                    nzLabel="Subsequent"
                    nzValue="Subsequent"
                  ></nz-option>
                  <nz-option nzLabel="Subtype" nzValue="Subtype"></nz-option>
                </nz-select>
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="code">
                Code
              </nz-form-label>
              <nz-form-control [nzSm]="16" [nzXs]="24">
                <input nz-input formControlName="code" id="code" />
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="associatedArea">
                Name
              </nz-form-label>
              <nz-form-control [nzSm]="16" [nzXs]="24">
                <app-pick-list
                  header="Area"
                  placeholder="Select an area"
                  formControlName="associatedArea"
                  id="associatedArea"
                  [items]="areasToPick"
                  [unloadToTemplate]="formTemplate"
                ></app-pick-list>
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="description">
                Description
              </nz-form-label>
              <nz-form-control [nzSm]="16" [nzXs]="24">
                <textarea
                  nz-input
                  rows="3"
                  formControlName="description"
                  id="description"
                ></textarea>
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="status">
                Status
              </nz-form-label>
              <nz-form-control [nzSm]="16" [nzXs]="24">
                <input readonly nz-input formControlName="status" id="status" />
              </nz-form-control>
            </nz-form-item>
          </nz-form-item>
          <div class="action-bar">
            <button nz-button nzType="default" (click)="onCancel()">
              Cancel
            </button>
            <button nz-button nzType="primary" (click)="onAdd()">
              Add
            </button>
          </div>
        </nz-collapse-panel>
      </nz-collapse>
    </ng-template>
    <ag-grid-angular
      class="ag-theme-balham"
      rowSelection="multiple"
      colResizeDefault="shift"
      noRowsOverlayComponent="emptyOverlay"
      [stopEditingWhenGridLosesFocus]="true"
      [suppressCellSelection]="true"
      [rowHeight]="32"
      [rowData]="value"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [frameworkComponents]="frameworkComponents"
      (gridReady)="onGridReady($event)"
      (selectionChanged)="onRowSelect($event.api.getSelectedRows())"
      (cellEditingStopped)="onCellEditingStopped()"
    >
    </ag-grid-angular>
    <div class="action-bar">
      <button
        nz-button
        nzType="danger"
        [disabled]="!selectedItem"
        (click)="onRemove()"
      >
        Remove
      </button>
      <button nz-button nzType="primary" (click)="onShowAdd()">
        Add
      </button>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: AssociatedAreaListFormComponent,
      multi: true
    }
  ]
})
export class AssociatedAreaListFormComponent
  implements OnInit, ControlValueAccessor {
  @Input()
  areasToPick: any[] = [
    { code: 'SMPL-01', name: 'Sample 1' },
    { code: 'SMPL-02', name: 'Sample 2' },
    { code: 'SMPL-03', name: 'Sample 3' }
  ];

  form: FormGroup;

  @ViewChild('formTemplate', { static: true })
  formTemplateRef: TemplateRef<any>;

  value: any[];

  disabled = false;

  selectedItem: any;

  columnDefs: ColDef[] = [
    {
      headerName: 'Association Type',
      field: 'associationType',
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['Subsequent', 'Subtype']
      }
    },
    {
      headerName: 'Code',
      editable: true,
      field: 'code',
      sortable: true
    },
    { headerName: 'Name', field: 'associatedArea.name', sortable: true },
    {
      headerName: 'Description',
      editable: true,
      field: 'description'
    },
    {
      headerName: 'Status',
      editable: true,
      field: 'status'
    }
  ];

  defaultColDef: ColDef = {
    resizable: true,
    filter: true
  };

  gridApi: GridApi;
  frameworkComponents = {
    emptyOverlay: EmptyListComponent
  };

  get cleanValue() {
    return JSON.parse(JSON.stringify(this.value));
  }

  onChange: (obj: any) => void;
  onTouch: () => void;

  constructor(
    private panelService: PanelService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      areaAssociationID: [uuid()],
      associationType: [],
      associatedArea: [],
      code: [],
      description: [],
      status: ['New']
    });
  }

  writeValue(obj: any): void {
    if (isEmpty(obj)) {
      this.value = [];
    } else {
      this.value = JSON.parse(JSON.stringify(obj));
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  onCellEditingStopped() {
    this.onChange(this.cleanValue);
  }

  onGridReady(gridOptions: GridOptions) {
    this.gridApi = gridOptions.api;
    this.gridApi.sizeColumnsToFit();
  }

  onRowSelect(items: any[]) {
    this.selectedItem = items[0];
  }

  onCancel() {
    this.panelService.unload();
  }

  onShowAdd() {
    this.panelService.load(this.formTemplateRef);
  }

  onAdd() {
    this.value = [...this.value, this.form.value];
    this.onChange(this.cleanValue);
    this.panelService.unload();
  }

  onRemove() {
    this.value = this.value.filter(
      p => p.areaAssociationID !== this.selectedItem.areaAssociationID
    );
    this.onChange(this.cleanValue);
  }
}
