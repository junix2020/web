import {
  Component,
  HostListener,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CategoryTypeService } from '@web/graphql';
import { EmptyListComponent, PanelService } from '@web/shell';
import { isNil, isNotEmpty } from '@web/util';
import { ColDef, GridApi, GridOptions } from 'ag-grid-community';
import { Observable } from 'rxjs';
import { AreaClassification, createClassification } from '../state';

@Component({
  selector: 'app-area-classification-list-box',
  template: `
    <ng-template #listTemplate>
      <nz-collapse>
        <nz-collapse-panel
          nzHeader="Area Classifications"
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
            [rowData]="items$ | async"
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
        <ag-grid-angular
          class="ag-theme-balham list-box"
          rowSelection="single"
          noRowsOverlayComponent="emptyOverlay"
          [suppressCellSelection]="true"
          [rowHeight]="32"
          [rowData]="shadowValue"
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
          [disabled]="!selectedFieldItem || disabled"
          (click)="onRemove()"
        >
          <i nz-icon nzType="minus" nzTheme="outline"></i>
        </button>
      </div>
    </div>
  `,
  styleUrls: [`./area-classification-list-box.component.less`],
  providers: [
    {
      useExisting: AreaClassificationListBoxComponent,
      provide: NG_VALUE_ACCESSOR,
      multi: true,
    },
  ],
})
export class AreaClassificationListBoxComponent
  implements OnInit, ControlValueAccessor {
  shadowValue: AreaClassification[] = [];
  actualValue: AreaClassification[] = [];
  columns: ColDef[] = [{ headerName: 'Name', field: 'name' }];
  fieldColumns: ColDef[] = [{ headerName: 'Name', field: 'categoryType' }];
  items$: Observable<any[]>;

  @Input()
  areaType: string;

  @ViewChild('listTemplate', { static: true })
  listTemplateRef: TemplateRef<any>;

  selectedItem: any;
  selectedFieldItem: any;

  disabled = false;

  defaultColDef: ColDef = {
    resizable: true,
    filter: true,
  };

  frameworkComponents = {
    emptyOverlay: EmptyListComponent,
  };

  gridApi: GridApi;

  onChange: (_: any) => void;
  onTouch: () => void;

  constructor(
    private panelService: PanelService,
    private categoryTypeService: CategoryTypeService,
  ) {}

  ngOnInit() {
    this.categoryTypeService
      .findByName(this.areaType)
      .subscribe(categoryType => {
        this.writeValue([createClassification(categoryType, true)]);
        this.onChange(this.actualValue);
      });

    // const httpCall$ = this.categoryTypeService.findByAssociation(
    //   'Instance Classification',
    //   this.areaType
    // );
    // this.items$ = httpCall$.pipe(
    //   map(x =>
    //     x.filter(
    //       a =>
    //         !a.mutuallyExclusiveIndicator ||
    //         a.associatedCategoryTypes.findIndex(b =>
    //           isNotNil(
    //             this.actualValue.find(
    //               v =>
    //                 isNil(v.endDateTime) &&
    //                 v.categoryType === b.associatedCategoryType.name
    //             )
    //           )
    //         ) < 0
    //     )
    //   ),
    //   flatMap(c => c.map(x => x.associatedCategoryTypes)),
    //   flatMap(x => x),
    //   map(x => x.associatedCategoryType),
    //   toArray()
    // );
  }

  writeValue(obj: any): void {
    if (isNotEmpty(obj)) {
      this.actualValue = obj;
    } else {
      this.actualValue = [];
    }
    this.updateShadowValue();
  }

  updateShadowValue() {
    this.shadowValue = this.actualValue.filter(
      x => !x.primaryTypeIndicator && isNil(x.endDateTime),
    );
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

  onAdd() {
    this.panelService.load(this.listTemplateRef);
  }

  onRemove() {
    this.actualValue = this.actualValue.map(p => {
      if (p.categoryType === this.selectedFieldItem.categoryType) {
        p.endDateTime = new Date();
      }
      return p;
    });
    this.updateShadowValue();
  }

  onOkay() {
    this.actualValue = [
      ...this.actualValue,
      createClassification(this.selectedItem),
    ];
    this.updateShadowValue();
    this.onChange(this.actualValue);
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
    this.actualValue = [...this.actualValue, createClassification(item)];
    this.onChange(this.actualValue);
    this.updateShadowValue();
    this.panelService.unload();
  }
}
