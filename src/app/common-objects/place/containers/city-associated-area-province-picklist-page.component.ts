import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { CityAssociatedAreaProvinceDTO } from '../dto/city-associated-area-province-picklist.dto';
import { CityAssociatedAreasProvincePicklistService } from '../services/city-associated-area-province-picklist.service';
import { CityAssociatedAreasProvinceQuery } from '../state/city-associated-area-province-picklist.query';
import { Toolbar, pickListFormToolbars, ToolbarItemType, ToolbarType } from '../../../shell';
import { takeUntil } from 'rxjs/operators';
import { CityAssociatedAreaProvincePickListComponent } from '../components/city-associated-area-province-picklist.component';

@Component({
  selector: 'city-associated-area-province-picklist-page',
  template: `
    <nz-collapse>
      <nz-collapse-panel
        nzHeader="Province"
        [nzDisabled]="false"
        [nzActive]="true"
        [nzShowArrow]="false"
      >
        <ng-container *ngIf="provinces$ | async as provinces">
          <section [class.hide]="isLoading$ | async">
            <city-associated-area-province-picklist
              [provinces]="provinces"
              (itemSelect)="onItemSelect($event)"
              (itemDoubleClick)="onItemDoubleClick($event)"
            >
            </city-associated-area-province-picklist>
          </section>
        </ng-container>
      </nz-collapse-panel>
    </nz-collapse>
  `
})
export class CityAssociateAreaProvincePickListPageComponent
    implements OnInit, OnDestroy, AfterViewInit {
// a variable to store observable data
    isLoading$: Observable<boolean>;
    provinces$: Observable<CityAssociatedAreaProvinceDTO[]>;

// a variable to destroy observable
  destroy$ = new Subject();

// a view child decorator with component
  @ViewChild (CityAssociatedAreaProvincePickListComponent, { static: false }) cityAssociatedAreaProvincePickListComponent: CityAssociatedAreaProvincePickListComponent;

  constructor(
    private cityAssociatedAreasProvincePicklistService: CityAssociatedAreasProvincePicklistService,
    private cityAssociatedAreasProvinceQuery: CityAssociatedAreasProvinceQuery,
    private route: ActivatedRoute,
    private router: Router,
    private toolbar: Toolbar
  ) {}

  ngAfterViewInit() {}

// method to call service and get the data(s) from the server
  getProvinces() {
    this.cityAssociatedAreasProvincePicklistService.getProvinces().subscribe();
    this.isLoading$ = this.cityAssociatedAreasProvinceQuery.selectLoading();
    this.provinces$ = this.cityAssociatedAreasProvinceQuery.selectAll();
    }

// method or event that all initializations are put in here
    ngOnInit() {

        // subscribe toolbar item
        this.toolbar.clicked$
            .pipe(takeUntil(this.destroy$))
            .subscribe(type => this.onToolbarItemClicked(type));
        this.toolbar.load(...pickListFormToolbars());

      if (this.cityAssociatedAreasProvinceQuery.getAll().length > 0) {
        this.provinces$ = this.cityAssociatedAreasProvinceQuery.selectAll();
    }   else {
          this.getProvinces();
      }
    }

    // method to call toolbar services
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

// method to get the current grid selected item and return to parent url
    onSelect() {
        this.cityAssociatedAreaProvincePickListComponent.onSelect();
    }

// method to to cancel the the selection and return to parent url
    onCancel() {
        this.cityAssociatedAreaProvincePickListComponent.onCancel();
    }

// method or event to destroy the observable
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

// method to implement when user select the current item using a double clicked
  onItemDoubleClick(item: any) {
    //this.router.navigate(['edit'], { relativeTo: this.route });
    //this.toolbar.disable(ToolbarType.VIEW);
  }

// not yet implemented
  onItemSelect(item: any) {}
}
