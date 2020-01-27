import {
  Component,
  HostListener,
  Input,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Router } from '@angular/router';
import { isNotNil } from '@web/util';
import { ColDef, GridApi, GridOptions } from 'ag-grid-community';
import { EmptyListComponent } from '../components/empty-list.component';
import { PanelService } from '../services/panel.service';

/**
 * A pick list. This is a component that can let users browse an array in a seamless manner, breaking panel boundaries,
 * soaring throughout the legends as this component breaks the simpliest thing of one smart component per screen.
 *
 * This component will amaze you in a way that it will become smarter than the smart component, gashing away at their screen
 * like the fangs of cerberus removing the smart component from view completely and let everyone be aware of the majesty
 * of this smarter than the smart component.
 *
 * Now for a little bedtime story, the inputs for this component are simply an array of objects, one for the actual items,
 * and one for the column definitions. This component outputs almost absolutely nothing! This component knows how to react
 * to such, as this component is personally trained by the mindblowing and mindhungry gods.
 */
@Component({
  selector: 'app-pick-list',
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
          </div>
        </nz-collapse-panel>
      </nz-collapse>
    </ng-template>
    <div fxLayout="row">
      <div fxFlex="1 1 auto">
        <input
          nz-input
          readonly
          [value]="displayName"
          [disabled]="disabled"
          [placeholder]="placeholder"
        />
      </div>
      <div fxFlex="0 0 0">
        <button nz-button [disabled]="disabled" (click)="onClick()">
          <i nz-icon nzType="ellipsis" nzTheme="outline"></i>
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./pick-list.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PickListComponent,
      multi: true
    }
  ]
})
export class PickListComponent implements ControlValueAccessor {
  @Input()
  header: string;
  @Input()
  items: any[] = [];
  @Input()
  columns: ColDef[] = [
    { headerName: 'Name', field: 'name' },
    { headerName: 'Description', field: 'description' }
  ];
  @Input()
  placeholder: string;
  @Input()
  saveUrl: string;
  /**
   * I think this is a very bad thing to do, but we have a very big time constraint
   * so this will make do.
   */
  @Input()
  unloadToTemplate: TemplateRef<any>;

  @ViewChild('listTemplate', { static: true })
  listTemplateRef: TemplateRef<any>;

  disabled = false;

  defaultColDef: ColDef = {
    resizable: true,
    filter: true
  };

  selectedItem: any;

  gridApi: GridApi;

  frameworkComponents = {
    emptyOverlay: EmptyListComponent
  };

  get displayName() {
    return this.selectedItem && this.selectedItem.name;
  }

  onChange: (_: any) => void;
  onTouch: () => void;

  constructor(private panelService: PanelService, private router: Router) {}

  writeValue(value: any) {
    this.selectedItem = value;
  }

  registerOnChange(fn: (_: any) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean) {
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

  unload() {
    if (isNotNil(this.unloadToTemplate)) {
      this.panelService.load(this.unloadToTemplate);
    } else {
      this.panelService.unload();
    }
  }

  onNew() {
    this.router.navigate([this.saveUrl], {
      queryParams: {
        returnUrl: this.router.url
      }
    });
    this.panelService.showOutlet();
  }

  onOkay() {
    this.onChange(this.selectedItem);
    this.unload();
  }

  onCancel() {
    this.unload();
  }

  onClick() {
    this.panelService.load(this.listTemplateRef);
  }

  onRowSelect(items: any[]) {
    this.selectedItem = items[0];
  }

  onDoubleClick(item: any) {
    this.onChange(item);
    this.unload();
  }
}
