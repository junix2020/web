import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToolbarItem, ToolbarType } from '../services/toolbar.service';

export interface ToolbarClickEvent {
  type: string;
}

@Component({
  selector: 'app-toolbar',
  template: `
    <div>
      <button nz-button nzType="link" (click)="onNavigationButtonClick()">
        <i nz-icon [type]="navigationButtonIcon"></i>
      </button>
      <button
        nz-button
        nzType="link"
        *ngFor="let item of items"
        [disabled]="item.disabled"
        (click)="onButtonClick(item)"
      >
        {{ item.label }}
      </button>
    </div>
  `,
  styleUrls: ['./toolbar.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent {
  /**
   * Toolbar items to be rendered.
   */
  @Input()
  items: ToolbarItem[];

  /**
   * Enable/disable the navigation button on this toolbar.
   */
  @Input()
  navigationButton = true;

  /**
   * The current icon for the navigation icon.
   */
  @Input()
  navigationButtonIcon = 'menu-unfold';

  /**
   * Output a click event whenever any toolbar item is clicked.
   */
  @Output()
  toolbarClick = new EventEmitter<ToolbarClickEvent>();

  onButtonClick(item: ToolbarItem) {
    const { type } = item;
    this.toolbarClick.emit({ type });
  }

  onNavigationButtonClick() {
    this.toolbarClick.emit({
      type: ToolbarType.NAV
    });
  }
}
