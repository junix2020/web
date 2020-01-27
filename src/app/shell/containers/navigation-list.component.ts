import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { navigateUp } from '@web/util/navigateUp';
import { ColDef, ColumnApi, GridApi, GridOptions } from 'ag-grid-community';
import { NzModalService, NzTreeNodeOptions } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ColumnListModalComponent } from '../components/column-list-modal.component';
import { EmptyListComponent } from '../components/empty-list.component';
import {
  OnToolbarItemClick,
  Toolbar,
  toolbarItemClose,
  toolbarItemColumns,
  ToolbarItemType,
  toolbarItemView,
  ToolbarType
} from '../services/toolbar.service';
import { Tree } from '../services/tree.service';

@Component({
  selector: 'app-navigation-list',
  template: `
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
          [rowData]="rowData"
          [columnDefs]="columnDefs"
          [defaultColDef]="defaultColDef"
          [frameworkComponents]="frameworkComponents"
          (gridReady)="onGridReady($event)"
          (selectionChanged)="onRowSelect($event.api.getSelectedRows())"
          (rowDoubleClicked)="onDoubleClick($event.data)"
        >
        </ag-grid-angular>
      </nz-collapse-panel>
    </nz-collapse>
  `,
  styleUrls: ['./navigation-list.component.less']
})
export class NavigationListComponent
  implements OnInit, OnDestroy, OnToolbarItemClick {
  columnDefs: ColDef[] = [
    { headerName: 'Name', field: 'title' },
    { headerName: 'Description', field: 'description' }
  ];

  defaultColDef: ColDef = {
    resizable: true,
    filter: true
  };

  gridApi: GridApi;
  columnApi: ColumnApi;
  item: NzTreeNodeOptions;
  selectedItem: NzTreeNodeOptions;

  frameworkComponents = {
    emptyOverlay: EmptyListComponent
  };

  destroy$ = new Subject();

  get rowData() {
    return this.item ? this.item.children : [];
  }

  get header() {
    return this.item ? this.item.title : 'Undefined';
  }

  constructor(
    private toolbar: Toolbar,
    private tree: Tree,
    private router: Router,
    private modal: NzModalService
  ) {}

  ngOnInit() {
    this.toolbar.load(
      toolbarItemView(),
      toolbarItemColumns(),
      toolbarItemClose()
    );
    this.toolbar.clicked$
      .pipe(takeUntil(this.destroy$))
      .subscribe(type => this.onToolbarItemClicked(type));
    this.tree.selected$
      .pipe(takeUntil(this.destroy$))
      .subscribe(item => (this.item = item));
  }

  onGridReady(gridOptions: GridOptions) {
    this.gridApi = gridOptions.api;
    this.columnApi = gridOptions.columnApi;
    this.gridApi.sizeColumnsToFit();
  }

  @HostListener('window:resize')
  onResize() {
    this.gridApi.sizeColumnsToFit();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onToolbarItemClicked(type: ToolbarItemType) {
    switch (type) {
      case ToolbarType.VIEW:
        this.router.navigateByUrl(this.selectedItem.url);
        this.toolbar.disable(ToolbarType.VIEW);
        break;
      case ToolbarType.CLOSE:
        navigateUp(this.router);
        break;
      case ToolbarType.COLUMNS:
        const modalRef = this.modal.create({
          nzTitle: 'Columns',
          nzMask: false,
          nzMaskClosable: false,
          nzClosable: false,
          nzContent: ColumnListModalComponent,
          nzComponentParams: {
            columnDefs: this.columnDefs,
            colState: this.columnApi.getColumnState()
          }
        });
        modalRef.afterClose
          .pipe(takeUntil(this.destroy$))
          .subscribe(colState => {
            this.columnApi.setColumnState(colState);
            this.gridApi.sizeColumnsToFit();
          });
        break;
      default:
        break;
    }
  }

  onRowSelect(items: NzTreeNodeOptions[]) {
    this.selectedItem = items[0];
    this.toolbar.enable(ToolbarType.VIEW);
  }

  onDoubleClick(item: NzTreeNodeOptions) {
    this.router.navigateByUrl(item.url);
    this.toolbar.disable(ToolbarType.VIEW);
  }
}
