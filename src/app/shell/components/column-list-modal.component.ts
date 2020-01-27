import { Component, Input, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { NzModalRef } from 'ng-zorro-antd';

@Component({
  selector: 'app-column-list-modal',
  template: `
    <div>
      <nz-checkbox-group [(ngModel)]="checkOpts"></nz-checkbox-group>
    </div>
    <div *nzModalFooter>
      <button nz-button nzType="default" (click)="onCancel()">
        Cancel
      </button>
      <button nz-button nzType="primary" (click)="onOkay()">
        OK
      </button>
    </div>
  `,
  styleUrls: ['./column-list-modal.component.less']
})
export class ColumnListModalComponent implements OnInit {
  @Input()
  columnDefs: ColDef[];
  @Input()
  colState: any[];

  checkOpts: any[];

  constructor(private modal: NzModalRef) {}

  ngOnInit() {
    this.checkOpts = this.colState.map(c => {
      const columnDef = this.columnDefs.find(d => d.field === c.colId);
      const label = columnDef.headerName;
      const value = c.colId;
      const checked = !c.hide;
      return { label, value, checked };
    });
  }

  onCancel() {
    // No changes, just output usual column state
    this.modal.close(this.colState);
    this.modal.destroy();
  }

  onOkay() {
    // Output changed column state, do some mapping
    const newColState = this.colState.map(c => {
      const checkOpt = this.checkOpts.find(o => o.value === c.colId);
      const hide = !checkOpt.checked;
      return { ...c, hide };
    });

    this.modal.close(newColState);
    this.modal.destroy();
  }
}
