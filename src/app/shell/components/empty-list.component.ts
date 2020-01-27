import { Component } from '@angular/core';
import { INoRowsOverlayAngularComp } from 'ag-grid-angular';
import {
  IAfterGuiAttachedParams,
  INoRowsOverlayParams
} from 'ag-grid-community';

@Component({
  selector: 'app-empty-list',
  template: `
    <nz-empty></nz-empty>
  `,
  styleUrls: ['./empty-list.component.less']
})
export class EmptyListComponent implements INoRowsOverlayAngularComp {
  agInit(params: INoRowsOverlayParams): void {}
  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {}
}
