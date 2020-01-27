import {
  Component,
  HostListener,
  Input,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Router } from '@angular/router';
import { isNotEmpty } from '@web/util';
import { ColDef, GridApi, GridOptions } from 'ag-grid-community';
import { EmptyListComponent } from '../components/empty-list.component';
import { PanelService } from '../services/panel.service';

@Component({
  selector: 'app-list-box',
  template: `
    <ng-template #listTemplate>
      <nz-collapse>
        <nz-collapse-panel
          [nzHeader]="header"
          [nzActive]="true"
          [nzShowArrow]="false"
        >
          <ag-grid-angular
            class="ag-theme-balham"
            rowSelection="multiple"
            colResizeDefault="shift"
            noRowsOverlayComponent="emptyOverlay"
            [suppressCellSelection]="true"
            [rowHeight]="32"
            [rowData]="items"
            [columnDefs]="columns"
            [defaultColDef]="defaultColDef"
            [frameworkComponents]="frameworkComponents"
            (gridReady)="onGridReady($event)"
            (selectionChanged)="onRowSelect($event.api.getSelectedRows())"
            (rowDoubleClicked)="onDoubleClick($event.data)"
          >
          </ag-grid-angular>
          <div class="action-bar">
            <button nz-button nzType="default" (click)="onCancel()">
              Cancel
            </button>
            <button
              nz-button
              nzType="primary"
              [disabled]="!selectedItem"
              (click)="onOkay()"
            >
              Select
            </button>
            <button nz-button nzType="primary" (click)="onNew()">
              New
            </button>
          </div>
        </nz-collapse-panel>
      </nz-collapse>
    </ng-template>
    <div fxLayout="row">
      <div fxFlex="1 1 auto">
        <ag-grid-angular
          class="ag-theme-balham list-box"
          rowSelection="single"
          noRowsOverlayComponent="emptyOverlay"
          [suppressCellSelection]="true"
          [rowHeight]="32"
          [rowData]="value"
          [columnDefs]="fieldColumns"
          [frameworkComponents]="frameworkComponents"
          (gridReady)="onGridReady($event)"
          (selectionChanged)="onFieldRowSelect($event.api.getSelectedRows())"
        >
        </ag-grid-angular>
      </div>
      <div fxFlex="0 0 0">
        <button
          nz-button
          nzType="primary"
          [disabled]="disabled"
          (click)="onAdd()"
        >
          <i nz-icon nzType="plus" nzTheme="outline"></i>
        </button>
        <button
          nz-button
          nzType="danger"
          [disabled]="!selectedFieldItem"
          (click)="onRemove()"
        >
          <i nz-icon nzType="minus" nzTheme="outline"></i>
        </button>
      </div>
    </div>
  `,
  styleUrls: [`./list-box.component.less`],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ListBoxComponent,
      multi: true
    }
  ]
})
export class ListBoxComponent implements ControlValueAccessor {
  value: any[] = [];
  @Input()
  header: string;
  @Input()
  items: any[];
  @Input()
  columns: ColDef[] = [{ headerName: 'Name', field: 'name' }];
  @Input()
  fieldColumns: ColDef[] = [{ headerName: 'Name', field: 'name' }];
  @Input()
  saveUrl: string;

  @ViewChild('listTemplate', { static: true })
  listTemplateRef: TemplateRef<any>;

  selectedItem: any;
  selectedFieldItem: any;

  disabled = false;

  defaultColDef: ColDef = {
    resizable: true,
    filter: true
  };

  frameworkComponents = {
    emptyOverlay: EmptyListComponent
  };

  gridApi: GridApi;

  onChange: (_: any) => void;
  onTouch: () => void;

  constructor(private panelService: PanelService, private router: Router) {}

  writeValue(obj: any): void {
    if (isNotEmpty(obj)) {
      this.value = obj;
    } else {
      this.value = [];
    }
  }
  registerOnChange(fn: (_: any) => void) {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void) {
    this.onTouch = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onGridReady(gridOptions: GridOptions) {
    this.gridApi = gridOptions.api;
    this.gridApi.sizeColumnsToFit();
  }

  @HostListener('window:resize')
  onResize() {
    this.gridApi && this.gridApi.sizeColumnsToFit();
  }

  onNew() {
    this.router.navigate([this.saveUrl], {
      queryParams: {
        returnUrl: this.router.url
      }
    });
    this.panelService.showOutlet();
  }

  onAdd() {
    this.panelService.load(this.listTemplateRef);
  }

  onRemove() {
    this.value = this.value.filter(p => p.name !== this.selectedFieldItem.name);
  }

  onOkay() {
    this.value = [...this.value, this.selectedItem];
    this.onChange(this.value);
    this.panelService.unload();
  }

  onCancel() {
    this.panelService.unload();
  }

  onFieldRowSelect(items: any[]) {
    this.selectedFieldItem = items[0];
  }

  onRowSelect(items: any[]) {
    this.selectedItem = items[0];
  }

  onDoubleClick(item: any) {
    this.value = [...this.value, item];
    this.onChange(this.value);
    this.panelService.unload();
  }
}
