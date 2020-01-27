import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ColumnListModalComponent,
  EmptyListComponent,
  listToolbars,
  OnToolbarItemClick,
  Toolbar,
  ToolbarItemType,
  ToolbarType,
} from '@web/shell';
import { navigateUp } from '@web/util/navigateUp';
import { ColDef, ColumnApi, GridApi, GridOptions } from 'ag-grid-community';
import { NzModalService } from 'ng-zorro-antd';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Area, AreaQuery, AreaService } from '../state';

@Component({
  template: `
    <nz-collapse>
      <nz-collapse-panel
        nzHeader="Municipality"
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
  styles: [],
})
export class MunicipalityListPage
  implements OnInit, OnDestroy, OnToolbarItemClick {
  columnDefs: ColDef[] = [
    { headerName: 'Code', field: 'code', sortable: true },
    { headerName: 'Name', field: 'name', sortable: true },
    { headerName: 'Description', field: 'description' },
    { headerName: 'Status', field: 'status' },
  ];

  defaultColDef: ColDef = {
    resizable: true,
    filter: true,
  };

  gridApi: GridApi;
  columnApi: ColumnApi;
  frameworkComponents = {
    emptyOverlay: EmptyListComponent,
  };

  selectedItems: Area[];
  destroy$ = new Subject();
  items$: Observable<Area[]>;

  constructor(
    private toolbar: Toolbar,
    private router: Router,
    private route: ActivatedRoute,
    private modal: NzModalService,
    private service: AreaService,
    private query: AreaQuery,
  ) {}

  ngOnInit() {
    this.toolbar.load(...listToolbars());
    this.toolbar.clicked$
      .pipe(takeUntil(this.destroy$))
      .subscribe(type => this.onToolbarItemClicked(type));
    this.items$ = this.query.selectAll({
      filterBy: a =>
        a.areaClassifications.findIndex(
          i => i.categoryType === 'Municipality',
        ) >= 0,
    });
    this.service.findAll('Municipality').subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onToolbarItemClicked(type: ToolbarItemType) {
    switch (type) {
      case ToolbarType.NEW:
        this.router.navigate(['new'], { relativeTo: this.route });
        break;
      case ToolbarType.VIEW:
        this.router.navigate([this.selectedItems[0].areaID], {
          relativeTo: this.route,
        });
        break;
      case ToolbarType.EDIT:
        this.router.navigate([this.selectedItems[0].areaID], {
          relativeTo: this.route,
          queryParams: {
            edit: 'true',
          },
        });
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
            colState: this.columnApi.getColumnState(),
          },
        });
        modalRef.afterClose
          .pipe(takeUntil(this.destroy$))
          .subscribe(colState => {
            this.columnApi.setColumnState(colState);
            this.gridApi.sizeColumnsToFit();
          });
        break;
      case ToolbarType.DELETE:
        this.modal.confirm({
          nzTitle: `Are you sure you want to delete ${this.selectedItems.length} item(s)?`,
          nzContent: 'This action cannot be reversed!',
          nzOkText: 'Yes',
          nzOkType: 'danger',
          nzOnOk: () =>
            this.service
              .removeByIDs(this.selectedItems.map(a => a.areaID))
              .subscribe(),
          nzCancelText: 'No',
        });
        break;
      default:
        break;
    }
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

  onRowSelect(items: Area[]) {
    this.selectedItems = items;

    const hasNonDrafts =
      this.selectedItems.findIndex(i => i.status !== 'Draft') >= 0;

    if (hasNonDrafts) {
      this.toolbar.disable(ToolbarType.DELETE);
    } else {
      this.toolbar.enable(ToolbarType.DELETE);
    }
    if (items.length === 1) {
      this.toolbar.enable(ToolbarType.VIEW, ToolbarType.EDIT);
    } else {
      this.toolbar.disable(ToolbarType.VIEW, ToolbarType.EDIT);
    }
  }

  onDoubleClick(item: Area) {
    this.router.navigate([item.areaID], { relativeTo: this.route });
  }
}
