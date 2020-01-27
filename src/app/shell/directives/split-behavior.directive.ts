import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

export interface Position {
  x: number;
  y: number;
}

export enum SplitBehavior {
  fixed,
  dynamic
}

/**
 * Marks an element as content area inside a resizable split container.
 * The input value of the directive can either be 'fixed' or 'dynamic' and describes the way
 * the content area is expected to resize within the split container space.
 * - A fixed element is expected to have an explicitly defined size, which can be resized by the user through a split element
 * - A dynamic element is expected to fill up the space next to fixed elements.
 *
 * Initially, the directive will set CSS flex box attributes to stack them horizontally.
 * It also serves as a data provider to expose the element width of the hosting content area, which is most likely a div.
 * Last but not least, the directive takes care of resizing the host element.
 *
 * @example
 * <div appSplitBehaviour="fixed">
 * </div>
 */
@Directive({
  selector: '[appSplitBehavior]'
})
export class SplitBehaviorDirective implements OnInit {
  private splitBehaviour: SplitBehavior;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @Input('appSplitBehavior')
  public set behaviour(value: string) {
    this.splitBehaviour = SplitBehavior[value];
  }

  public get behaviour(): string {
    return SplitBehavior[this.splitBehaviour];
  }

  public resize(vector: Position) {
    const outerWidth = window.innerWidth;
    const styles = getComputedStyle(this.el.nativeElement);
    const maxWidth = parseInt(styles.maxWidth, 10);
    const percentMaxWidth = maxWidth / 100;
    const actualMaxWidth = outerWidth * percentMaxWidth;

    if (vector.x < actualMaxWidth) {
      this.renderer.setStyle(this.el.nativeElement, 'width', `${vector.x}px`);
    }
  }

  public getElementWidth(): number {
    const paddingL = parseInt(
      window
        .getComputedStyle(this.el.nativeElement, null)
        .getPropertyValue('padding-left'),
      10
    );
    const paddingR = parseInt(
      window
        .getComputedStyle(this.el.nativeElement, null)
        .getPropertyValue('padding-right'),
      10
    );
    return (this.el.nativeElement.offsetWidth as number) - paddingL - paddingR;
  }

  public ngOnInit() {
    if (this.splitBehaviour.valueOf() === SplitBehavior.fixed.valueOf()) {
      this.renderer.setStyle(this.el.nativeElement, 'flex', '0 0 auto');
    } else if (
      this.splitBehaviour.valueOf() === SplitBehavior.dynamic.valueOf()
    ) {
      this.renderer.setStyle(this.el.nativeElement, 'flex', '1 1 auto');
    }
    this.renderer.setStyle(this.el.nativeElement, 'overflow', 'auto');
  }
}
