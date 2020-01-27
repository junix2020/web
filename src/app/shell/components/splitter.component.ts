import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {
  Position,
  SplitBehaviorDirective
} from '../directives/split-behavior.directive';
import { SplitterService } from '../services/splitter.service';

/**
 * A horizontal, draggable divider element between resizable content areas within a split container.
 * This component and its creation is managed by a split container.
 */
@Component({
  selector: 'app-splitter',
  template: `
    <div
      #splitter
      (mousedown)="onMouseDown($event)"
      (document:mouseup)="onMouseUp($event)"
      (document:mousemove)="onMouseMove($event)"
    ></div>
  `,
  styleUrls: ['./splitter.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SplitterComponent {
  private startX: number;
  private startWidth: number;
  private dragging = false;
  @Input()
  public splitBehaviour: SplitBehaviorDirective;
  @Output()
  public positionChanged = new EventEmitter<Position>();

  constructor(private splitterService: SplitterService) {}

  onMouseDown(e: MouseEvent): void {
    this.dragging = true;
    this.startX = e.clientX;
    this.startWidth = this.splitBehaviour.getElementWidth();
  }

  onMouseUp(e: MouseEvent): void {
    this.dragging = false;
    this.splitterService.mouseUp();
  }

  onMouseMove(e: MouseEvent): void {
    if (this.dragging) {
      const x = this.startWidth + e.clientX - this.startX;
      const y = e.pageY;
      this.positionChanged.emit({ x, y });

      if (document.getSelection()) {
        document.getSelection().empty();
      } else {
        window.getSelection().removeAllRanges();
      }
    }
  }
}
