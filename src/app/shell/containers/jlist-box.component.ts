import { Component, Input, TemplateRef, ViewChild, EventEmitter, Output, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Router } from '@angular/router';
import { isNotEmpty } from '@web/util';
import { ColDef, GridOptions, GridApi } from 'ag-grid-community';
import { EmptyListComponent } from '../components/empty-list.component';
import { PanelService } from '../services/panel.service';

@Component({
	selector: 'app-jlist-box',
	template: `
	 <div fxLayout="row">
		<div fxFlex="1 1 auto">
			<ag-grid-angular
			 class="ag-theme-balham list-box"
			 rowSelection="multiple"
			 noRowsOverlayComponent="emptyOverlay"
			 [suppressCellSelection]="true"
			 [rowHeight]="32"
			 [rowData]="lists"
			 [columnDefs]="fieldColumns"
			 [frameworkComponents]="frameworkComponents"
			 (gridReady)="onGridReady($event)"
			>
			</ag-grid-angular>
		</div>
		<div fxFlex="0 0 0">
			<button
			 nz-button
			 nzType="primary"
			 [disabled]="!isMsg"
			 (click)="onAdd()"
			>
			 <i nz-icon nzType="plus" nzTheme="outline"></i>
			</button>
			<button
			 nz-button
			 nzType="danger"
			[disabled]="!isMsg"
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
		useExisting: JListBoxComponent,
		multi: true
	 }
	]
})
export class JListBoxComponent implements OnInit {
	@Input() lists: any[] = [];

 
	@Input()
	header: string;
	
	@Input()
	columns: ColDef[] = [{ headerName: 'Name', field: 'name' }];
	@Input()
	fieldColumns: ColDef[] = [
			{ headerName: 'Name', field: 'name' },
			{ headerName: 'Id', field: 'id', hide: true}
	];
	@Input()
	saveUrl: string;

	@Output()	addClassification = new EventEmitter();
	@Output() deleteClassification = new EventEmitter<any>();

	@Input() isMsg: boolean;

	gridApi: GridApi;

 
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

	
	constructor(private panelService: PanelService, private router: Router) {}

	ngOnInit() {
	}

	
	setDisabledState(isDisabled: boolean): void {
	 this.disabled = isDisabled;
	}

	
	onGridReady(gridOptions: GridOptions) {
		this.gridApi = gridOptions.api;
		gridOptions.api.sizeColumnsToFit();

			
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
		this.addClassification.emit();
	}

	onRemove() {
		try {
			var selectedRows = this.gridApi.getSelectedRows();
			this.deleteClassification.emit(selectedRows);
			this.gridApi.updateRowData({ remove: selectedRows });
		} catch (e) {

		}
		
		
	}

 }
