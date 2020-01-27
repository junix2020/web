import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StatusTypeService } from '@web/graphql';
import { StatusType } from '@web/graphql/models';
import {
  ColumnListModalComponent,
  EmptyListComponent,
  listToolbars,
  SplitterService,
  Toolbar,
  ToolbarItemType,
  ToolbarType,
} from '@web/shell';
import { navigateUp } from '@web/util/navigateUp';
import { ColDef, ColumnApi, GridApi, GridOptions } from 'ag-grid-community';
import { NzModalService } from 'ng-zorro-antd';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-status-type-list-page',
  template: `
    <nz-collapse>
      <nz-collapse-panel
        nzHeader="Status Type"
        [nzActive]="true"
        [nzShowArrow]="false"
        [nzDisabled]="true"
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
export class StatusTypeListPage {
  columnDefs: ColDef[] = [
    { headerName: 'Code', field: 'code' },
    { headerName: 'Name', field: 'name' },
    {
      headerName: 'Description',
      field: 'description',
    },
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

  selectedItems: StatusType[];
  items$: Observable<StatusType[]>;
  destroy$ = new Subject();

  constructor(
    private toolbar: Toolbar,
    private router: Router,
    private route: ActivatedRoute,
    private modal: NzModalService,
    private service: StatusTypeService,
    private splitter: SplitterService,
  ) {}

  ngOnInit() {
    this.toolbar.load(...listToolbars());
    this.toolbar.clicked$
      .pipe(takeUntil(this.destroy$))
      .subscribe(type => this.onToolbarItemClicked(type));
    this.splitter.mouseUp$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.gridApi.sizeColumnsToFit());
    this.items$ = this.service.findAll();
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
        this.router.navigate([this.selectedItems[0].statusTypeID], {
          relativeTo: this.route,
        });
        break;
      case ToolbarType.EDIT:
        this.router.navigate([this.selectedItems[0].statusTypeID], {
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
              .deleteMany(this.selectedItems.map(a => a.statusTypeID))
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

  onRowSelect(items: StatusType[]) {
    this.selectedItems = items;

    if (items.length === 1) {
      this.toolbar.enable(
        ToolbarType.VIEW,
        ToolbarType.EDIT,
        ToolbarType.DELETE,
      );
    } else if (items.length === 0) {
      this.toolbar.disable(
        ToolbarType.VIEW,
        ToolbarType.EDIT,
        ToolbarType.DELETE,
      );
    } else {
      this.toolbar.disable(ToolbarType.VIEW, ToolbarType.EDIT);
    }
  }

  onDoubleClick(item: StatusType) {
    this.router.navigate([item.statusTypeID], { relativeTo: this.route });
  }
}
