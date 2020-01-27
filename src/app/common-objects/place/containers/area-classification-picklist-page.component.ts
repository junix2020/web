import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AreaClassificationPicklistDTO } from '../dto/area-classification-picklist.dto';
import { AreaClassificationsPicklistService } from '../services/area-classification-picklist.service';
import { AreaClassificationsPicklistQuery } from '../state/area-classification-picklist.query';
import { Toolbar, pickListFormToolbars, ToolbarItemType, ToolbarType } from '../../../shell';
import { AreaClassificationPickListComponent } from '../components/area-classification-picklist.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'area-classification-picklist-page',
  template: `
    <nz-collapse>
      <nz-collapse-panel
        nzHeader="Area Classifications"
        [nzDisabled]="false"
        [nzActive]="true"
        [nzShowArrow]="false"
      >
        <ng-container
          *ngIf="areaClassifications$ | async as areaClassifications"
        >
          <section [class.hide]="isLoading$ | async">
            <area-classification-picklist
              [areaClassifications]="areaClassifications"
              (itemSelect)="onItemSelect($event)"
              (itemDoubleClick)="onItemDoubleClick($event)"
            >
            </area-classification-picklist>
          </section>
        </ng-container>
      </nz-collapse-panel>
    </nz-collapse>
  `
})
export class AreaClassificationPickListPageComponent
    implements OnInit, OnDestroy, AfterViewInit {
// a variable that store observable
    areaClassifications$: Observable<AreaClassificationPicklistDTO[]>;
    isLoading$: Observable<boolean>;

// a variable the desctroy observable
   destroy$ = new Subject();

// a view child decorator with component
  @ViewChild(AreaClassificationPickListComponent, { static: false }) areaClassificationPickListComponent: AreaClassificationPickListComponent;

  constructor(
    private areaClassificationsPicklistService: AreaClassificationsPicklistService,
    private areaClassificationsPicklistQuery: AreaClassificationsPicklistQuery,
    private route: ActivatedRoute,
    private router: Router,
    private toolbar: Toolbar,
    private ref: ChangeDetectorRef
  ) {}

// method to call the service to retrieve data(s) from the server
  getAreaClassifications() {
    this.areaClassifications$ = this.areaClassificationsPicklistService.getAreaClassifications();
    this.isLoading$ = this.areaClassificationsPicklistQuery.selectLoading();
  }

// method or event that all initialzations are put here
    ngOnInit() {

    // subscribe toolbar item
       this.toolbar.clicked$
         .pipe(takeUntil(this.destroy$))
         .subscribe(type => this.onToolbarItemClicked(type));
       this.toolbar.load(...pickListFormToolbars());

      if (this.areaClassificationsPicklistQuery.getAll().length > 0) {
        this.areaClassifications$ = this.areaClassificationsPicklistQuery.selectAll();
      } else {
        this.getAreaClassifications();
      }
    }

// method to call service toolbar
    onToolbarItemClicked(type: ToolbarItemType) {
      switch (type) {
       case ToolbarType.pickListCancel:
         this.onCancel();
         break;
       case ToolbarType.pickListSelect:
         this.onSelect();
         break;
      }
    }

// method to select current grid item and return to parent url
    onSelect() {
      this.areaClassificationPickListComponent.onSelect();
    }

// method to cancel the grid selection and return to parent url
    onCancel() {
      this.areaClassificationPickListComponent.onCancel();
    }

// method or event to destroy observable
    ngOnDestroy() {
      this.destroy$.next();
      this.destroy$.complete();
    }

  ngAfterViewInit() {}

// not yet implemented
  onItemDoubleClick(item: any) {
    //this.router.navigate(['edit'], { relativeTo: this.route });
    //this.toolbar.disable(ToolbarType.VIEW);
  }

// not yet implemented
   onItemSelect(item: any) {}
}
