import { Component, OnInit, Input } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd';
import { colTarget, colSource } from '../../../common-objects/common-attributes/hide-unhide';


@Component({
    selector: 'booking-batch-show-hidden',
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
export class BookingBatchShowHiddenComponent implements OnInit {
    @Input() colData: colTarget[];
    @Input() sourceData: colSource[];
    isVisible = true;

    constructor(private modal: NzModalRef) { }

    ngOnInit() {

    }

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

    handleCancel(): void {
        this.modal.close(this.sourceData);
        this.sourceData = null;
        this.modal.destroy();
    }

}
