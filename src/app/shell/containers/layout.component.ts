import {
  ChangeDetectorRef,
  Component,
  EmbeddedViewRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToolbarClickEvent } from '../components/toolbar.component';
import { PanelService } from '../services/panel.service';
import { Toolbar, ToolbarItem, ToolbarType } from '../services/toolbar.service';

@Component({
  selector: 'app-layout',
  template: `
    <app-bar></app-bar>
    <app-toolbar
      [items]="toolbarItems"
      [navigationButtonIcon]="navigationButtonIcon"
      (toolbarClick)="onToolbarClick($event)"
    ></app-toolbar>
    <app-split fxLayout="row">
      <aside [hidden]="hideNavigation" appSplitBehavior="fixed">
        <app-tree></app-tree>
      </aside>
      <main appSplitBehavior="dynamic">
        <div class="box" [hidden]="hideOutlet">
          <router-outlet></router-outlet>
        </div>
        <div class="box" [hidden]="!hideOutlet">
          <template #panelContainer></template>
        </div>
      </main>
    </app-split>
  `,
  styleUrls: ['./layout.component.less']
})
export class LayoutComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();
  hideNavigation = false;
  hideOutlet = false;
  toolbarItems: ToolbarItem[];

  @ViewChild('panelContainer', { read: ViewContainerRef, static: true })
  panelContainer: ViewContainerRef;
  panelViewRef: EmbeddedViewRef<any>;

  get navigationButtonIcon() {
    return this.hideNavigation ? 'menu-unfold' : 'menu-fold';
  }

  constructor(
    private toolbar: Toolbar,
    private panelService: PanelService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Toolbar event handles
    this.toolbar.loaded$
      .pipe(takeUntil(this.destroy$))
      .subscribe(toolbarItems => {
        this.toolbarItems = toolbarItems;
        this.changeDetectorRef.detectChanges();
      });
    this.toolbar.enabled$
      .pipe(takeUntil(this.destroy$))
      .subscribe(toolbarType => {
        this.toolbarItems = this.toolbarItems.map(item => {
          if (item.type === toolbarType) {
            item.disabled = false;
          }
          return item;
        });
      });
    this.toolbar.disabled$
      .pipe(takeUntil(this.destroy$))
      .subscribe(toolbarType => {
        this.toolbarItems = this.toolbarItems.map(item => {
          if (item.type === toolbarType) {
            item.disabled = true;
          }
          return item;
        });
      });

    // Doomsday
    // Event handling for the wicked service
    this.panelService.loaded$
      .pipe(takeUntil(this.destroy$))
      .subscribe(templateRef => {
        this.hideOutlet = true;
        this.panelContainer.clear();
        this.panelViewRef = this.panelContainer.createEmbeddedView(templateRef);
      });
    this.panelService.unloaded$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.hideOutlet = false;
      this.panelViewRef.destroy();
    });
    this.panelService.outletVisibilityChange$
      .pipe(takeUntil(this.destroy$))
      .subscribe(visible => {
        this.hideOutlet = !visible;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onToolbarClick(e: ToolbarClickEvent) {
    // Special toolbar type for navigation show/hide toggle.
    // Otherwise, just fire toolbar click event
    if (e.type === ToolbarType.NAV) {
      this.hideNavigation = !this.hideNavigation;
    } else {
      this.toolbar.click(e.type);
    }
  }
}
