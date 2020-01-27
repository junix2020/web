import { Component, OnInit, Input } from '@angular/core';
import { colTarget, colSource } from '../../common-attributes/hide-unhide';
import { NzModalRef } from 'ng-zorro-antd';

@Component({
  selector: 'parties-list-show-hidden',
  template: `
   <nz-modal
        [(nzVisible)]="isVisible"
        [nzClosable] = "false"
        [nzMask] = "false"
        [nzTitle]="modalTitle"
        [nzContent]="modalContent"
        (nzOnCancel)="handleCancel()"
        (nzOnOk)="handleOk()"
     >
      <ng-template #modalTitle>
        Show Column
      </ng-template>
      <ng-template #modalContent>
          <div class="col-show-hide-box">
            <nz-checkbox-group [(ngModel)]="colData"></nz-checkbox-group>
          </div>
      </ng-template>
     
    </nz-modal>

  `,
  styles: [
    `
  `
  ]
})
export class PartiesListShowHiddenComponent implements OnInit {
  // a variables that recieve data(s) from parent component
  @Input() colData: colTarget[];
  @Input() sourceData: colSource[];

  // a boolean variable to set visible
  isVisible = true;

  constructor(private modal: NzModalRef) { }

  ngOnInit() {

  }

  // method to get the current column(s) that was set visible or hide
  handleOk() {
    var colReturn = new colSource();
    var targetCol = [];
    this.colData.map(c => {
      colReturn.headerName = c.label;
      colReturn.field = c.value;
      colReturn.hide = c.checked ? false : true;
      targetCol.push(Object.assign({}, colReturn));
    })
    this.modal.close(targetCol);
    targetCol = null;
    colReturn = null;
    this.modal.destroy();
  }

  // method to cancel show or hide columns
  handleCancel(): void {
    this.modal.close(this.sourceData);
    this.sourceData = null;
    this.modal.destroy();
  }

}
