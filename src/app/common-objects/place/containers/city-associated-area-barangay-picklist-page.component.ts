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
import { CityAssociatedAreaBarangayDTO } from '../dto/city-associated-area-barangay-picklist.dto';
import { CityAssociatedAreasBarangayPicklistService } from '../services/city-associated-area-barangay-picklist.service';
import { CityAssociatedAreasBarangayQuery } from '../state/city-associated-area-barangay-picklist.query';
import { Toolbar, pickListFormToolbars, ToolbarItemType, ToolbarType } from '../../../shell';
import { CityAssociatedAreaBarangayPickListComponent } from '../components/city-associated-area-barangay-picklist.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'city-associated-area-barangay-picklist-page',
  template: `
    <nz-collapse>
      <nz-collapse-panel
        nzHeader="Barangay"
        [nzDisabled]="false"
        [nzActive]="true"
        [nzShowArrow]="false"
      >
        <ng-container
          *ngIf="
            cityAssociatedAreaBarangays$ | async as cityAssociatedAreaBarangays
          "
        >
          <section [class.hide]="isLoading$ | async">
            <city-associated-area-barangay-picklist
              [barangays]="cityAssociatedAreaBarangays"
              (itemSelect)="onItemSelect($event)"
              (itemDoubleClick)="onItemDoubleClick($event)"
            >
            </city-associated-area-barangay-picklist>
          </section>
        </ng-container>
      </nz-collapse-panel>
    </nz-collapse>
  `
})
export class CityAssociatedAreaBarangayPickListPageComponent
    implements OnInit, OnDestroy, AfterViewInit {
// a variables to store observable
    cityAssociatedAreaBarangays$: Observable<CityAssociatedAreaBarangayDTO[]>;
    isLoading$: Observable<boolean>;

// a variable to destroy observable
  destroy$ = new Subject();

// a view child decorator with component
  @ViewChild(CityAssociatedAreaBarangayPickListComponent, { static: false }) cityAssociatedAreaBarangayPickListComponent: CityAssociatedAreaBarangayPickListComponent;

  constructor(
    private cityAssociatedAreasBarangayPicklistService: CityAssociatedAreasBarangayPicklistService,
    private cityAssociatedAreasBarangayQuery: CityAssociatedAreasBarangayQuery,
    private route: ActivatedRoute,
    private router: Router,
    private toolbar: Toolbar,
    private ref: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    
  }

// method to call the service and retrieve data(s) from the server
    getCityAreaBarangays() {
      this.cityAssociatedAreaBarangays$ = this.cityAssociatedAreasBarangayPicklistService.getCityAreaBarangays();
      this.isLoading$ = this.cityAssociatedAreasBarangayQuery.selectLoading();
    }

// method or event that all initializations are put in here
    ngOnInit() {
        // subscribe toolbar item
        this.toolbar.clicked$
            .pipe(takeUntil(this.destroy$))
            .subscribe(type => this.onToolbarItemClicked(type));
        this.toolbar.load(...pickListFormToolbars());

      // use store data(s) if it was already retrieved from the server
      if (this.cityAssociatedAreasBarangayQuery.getAll().length > 0) {
        this.cityAssociatedAreaBarangays$ = this.cityAssociatedAreasBarangayQuery.selectAll();
      } else {
        this.getCityAreaBarangays();  // else retrieve data(s) from the server
      }
    }

// method to call the toolbar service
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

// method to get the current selected item and return to parent url
    onSelect() {
        this.cityAssociatedAreaBarangayPickListComponent.onSelect();
    }

// method to cancel the current selected item and return to parent url
    onCancel() {
        this.cityAssociatedAreaBarangayPickListComponent.onCancel();
    }

// method or event to destroy the observable
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

// not yet implemented
  onItemDoubleClick(item: any) {
    //this.router.navigate(['edit'], { relativeTo: this.route });
    //this.toolbar.disable(ToolbarType.VIEW);
  }

// not yet implemented
  onItemSelect(item: any) {}
}
