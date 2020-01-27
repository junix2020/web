import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { AreaStatusTypeDTO } from '../dto/area-status-type-picklist.dto';
import { AreaStatusTypePicklistService } from '../services/area-status-type-picklist.service';
import { Toolbar, pickListFormToolbars, ToolbarItemType, ToolbarType } from '../../../shell';
import { AreaStatusTypeListComponent } from '../components/area-status-type-picklist.component';

@Component({
  selector: 'area-status-type-picklist-page',
  template: `
    <nz-collapse>
      <nz-collapse-panel
        nzHeader="Area Status Type"
        [nzDisabled]="false"
        [nzActive]="true"
        [nzShowArrow]="false"
      >
        <ng-container *ngIf="areaStatusTypes$ | async as areaStatusTypes">
            <area-status-type-picklist
            [areaStatusTypes]="areaStatusTypes"
            (itemSelect)="onItemSelect($event)"
            (itemDoubleClick)="onItemDoubleClick($event)"
          >
          </area-status-type-picklist>       
        </ng-container>
      </nz-collapse-panel>
    </nz-collapse>
  `
})
export class AreaStatusTypePickListPageComponent
    implements OnInit, OnDestroy, AfterViewInit {
// a variable that store observable
    areaStatusTypes$: Observable<AreaStatusTypeDTO>;
    state$: Observable<any>;

// default assocation id and stattus type id
    associationTypeId = '24fac1d9-a3ba-413c-96f0-52ae6ff1faad'; // subsequent association type
    statusTypeId: string; // "0615d7a0-6d66-4171-bb6f-f37c177e0df4" New : default status type

// a variable to stare data(s) from state$ observable
    sourceData: any;

// a variable that destroy observable
  destroy$ = new Subject();

// a view child decorator with component
  @ViewChild(AreaStatusTypeListComponent, { static: false }) areaStatusTypeListComponent: AreaStatusTypeListComponent;

  constructor(
    private areaStatusTypeService: AreaStatusTypePicklistService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toolbar: Toolbar
  ) {}

// method or event that all initializations are put in here
    ngOnInit() {
        // subscribe toolbar item
        this.toolbar.clicked$
            .pipe(takeUntil(this.destroy$))
            .subscribe(type => this.onToolbarItemClicked(type));
        this.toolbar.load(...pickListFormToolbars());

        this.state$ = this.activatedRoute.paramMap.pipe(
            map(() => window.history.state)
        );
        this.state$.subscribe(s => {
            this.sourceData = s;
        });

        if (this.sourceData.statusTypeId != null) {
            this.statusTypeId = this.sourceData.statusTypeId;
        } else {
            this.statusTypeId = '0615d7a0-6d66-4171-bb6f-f37c177e0df4'; // default to New status
        }

        this.areaStatusTypes$ = this.areaStatusTypeService.getPage({
            associationTypeId: this.associationTypeId,
            statusTypeId: this.statusTypeId
        });

        
    }

   ngAfterViewInit() {
    
  }

// method to call toolbar service
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

// method to select the current grid item
    onSelect() {
      this.areaStatusTypeListComponent.onSelect();
    }

// method to cancel the selected item ang return to parent url
    onCancel() {
      this.areaStatusTypeListComponent.onCancel();
    }

// method or event to destroy observable
    ngOnDestroy() {
      this.destroy$.next();
      this.destroy$.complete();
    }

// net yet implemented
    onItemDoubleClick(item: any) { }
    onItemSelect(item: any) { }

}
