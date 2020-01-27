import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  ContentChildren,
  OnDestroy,
  QueryList,
  ViewContainerRef
} from '@angular/core';
import { Subscription } from 'rxjs';
import {
  Position,
  SplitBehavior,
  SplitBehaviorDirective
} from '../directives/split-behavior.directive';
import { SplitterComponent } from './splitter.component';

/**
 * Hosts resizable content areas divided by a draggable border (splitter).
 *
 * The split container defined flex attributes to allow the horizontal arrangement of child content areas.
 * On initialization, it will query all child elements in the light DOM annotated by the split-behaviour directive
 * and separate them by splitters.
 * As the splitBehaviour directive manages concrete content area resizing, dragging events of the splitter (positionChanged) are subscribed
 * and propagated to the directive.
 */
@Component({
  selector: 'app-split',
  template: `
    <div>
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./split.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SplitComponent implements AfterContentInit, OnDestroy {
  // Workaround: We want to query all child elements hosting a SplitBehaviourDirective instance,
  // but we both need the respective ViewContainerRef (for splitter element creation)
  // as well as the respective Directive implementation instance.
  // There might be a better way to achieve this...
  @ContentChildren(SplitBehaviorDirective, { read: ViewContainerRef })
  private panesRef: QueryList<ViewContainerRef>;

  @ContentChildren(SplitBehaviorDirective)
  private panes: QueryList<SplitBehaviorDirective>;

  private positionSubscriptions: Subscription[] = [];

  constructor(private resolver: ComponentFactoryResolver) {}

  public ngAfterContentInit(): void {
    const splitterFactory = this.resolver.resolveComponentFactory(
      SplitterComponent
    );

    const paneDirectives = this.panes.toArray();

    this.panesRef.map((vcr, idx) => {
      if (
        paneDirectives[idx].behaviour === SplitBehavior[SplitBehavior.fixed]
      ) {
        const splitter = vcr.createComponent(splitterFactory);
        const positionSubscription = splitter.instance.positionChanged.subscribe(
          (pos: Position) => {
            paneDirectives[idx].resize(pos);
          }
        );
        splitter.instance.splitBehaviour = paneDirectives[idx];
        // Push subscribed position
        this.positionSubscriptions.push(positionSubscription);
      }
    });
  }

  ngOnDestroy() {
    // Do clean up
    this.positionSubscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}
