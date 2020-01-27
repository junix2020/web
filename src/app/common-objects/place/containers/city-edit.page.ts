import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  formEditToolbars,
  OnToolbarItemClick,
  Toolbar,
  ToolbarItemType,
  ToolbarType
} from '@web/shell';
import { navigateUp } from '@web/util/navigateUp';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-city-edit-page',
  template: `
    <nz-collapse>
      <nz-collapse-panel
        nzHeader="City"
        [nzActive]="true"
        [nzShowArrow]="false"
      >
      </nz-collapse-panel>
    </nz-collapse>
  `
})
export class CityEditPage implements OnInit, OnDestroy, OnToolbarItemClick {
  destroy$ = new Subject();

  constructor(private toolbar: Toolbar, private router: Router) {}

  ngOnInit() {
    this.toolbar.load(...formEditToolbars());
    this.toolbar.clicked$
      .pipe(takeUntil(this.destroy$))
      .subscribe(type => this.onToolbarItemClicked(type));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onToolbarItemClicked(type: ToolbarItemType) {
    switch (type) {
      case ToolbarType.CLOSE:
        navigateUp(this.router);
        break;
    }
  }
}
