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
import { CityAssociatedAreaCityDTO } from '../dto/city-associated-area-city-picklist.dto';
import { CityAssociatedAreasCityPicklistService } from '../services/city-associated-area-city-picklist.service';
import { CityAssociatedAreasCityQuery } from '../state/city-associated-area-city-picklist.query';
import { Toolbar, pickListFormToolbars, ToolbarItemType, ToolbarType } from '../../../shell';
import { CityAssociatedAreaCityPickListComponent } from '../components/city-associated-area-city-picklist.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'city-associated-area-barangay-picklist-page',
  template: `
    <nz-collapse>
      <nz-collapse-panel
        nzHeader="City"
        [nzDisabled]="false"
        [nzActive]="true"
        [nzShowArrow]="false"
      >
        <ng-container
          *ngIf="cityAssociatedAreaCities$ | async as cityAssociatedAreaCities"
        >
          <section [class.hide]="isLoading$ | async">
            <city-associated-area-city-picklist
              [cities]="cityAssociatedAreaCities"
              (itemSelect)="onItemSelect($event)"
              (itemDoubleClick)="onItemDoubleClick($event)"
            >
            </city-associated-area-city-picklist>
          </section>
        </ng-container>
      </nz-collapse-panel>
    </nz-collapse>
  `
})
export class CityAssociatedAreaCityPickListPageComponent
    implements OnInit, OnDestroy, AfterViewInit {
// a variables to store observable 
    cityAssociatedAreaCities$: Observable<CityAssociatedAreaCityDTO[]>;
    isLoading$: Observable<boolean>;

// a variable to destroy observable
  destroy$ = new Subject();

// a view child decorator with component
    @ViewChild(CityAssociatedAreaCityPickListComponent, { static: false }) cityAssociatedAreaCityPickListComponent: CityAssociatedAreaCityPickListComponent;

  constructor(
    private cityAssociatedAreasCityPicklistService: CityAssociatedAreasCityPicklistService,
    private cityAssociatedAreasCityQuery: CityAssociatedAreasCityQuery,
    private route: ActivatedRoute,
    private router: Router,
    private toolbar: Toolbar,
    private ref: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    
  }

// method to call the service then get data(s) from the server
  getCityAreaCities() {
    this.cityAssociatedAreaCities$ = this.cityAssociatedAreasCityPicklistService.getCityAreaCities();
    this.isLoading$ = this.cityAssociatedAreasCityQuery.selectLoading();
  }

// method or event that all initializations are put in here
    ngOnInit() {

      // subscribe toolbar item
      this.toolbar.clicked$
        .pipe(takeUntil(this.destroy$))
        .subscribe(type => this.onToolbarItemClicked(type));
          this.toolbar.load(...pickListFormToolbars());
      // use store data(s) once it was already retrieved from the server 
      if (this.cityAssociatedAreasCityQuery.getAll().length > 0) {
        this.cityAssociatedAreaCities$ = this.cityAssociatedAreasCityQuery.selectAll();
      } else {
          this.getCityAreaCities(); // else retrieve the data(s) from the server
      }
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

// method to get the current griid selected item and return to parent url
    onSelect() {
        this.cityAssociatedAreaCityPickListComponent.onSelect();
    }

// method to cancel the grid selection and return to parent url
    onCancel() {
        this.cityAssociatedAreaCityPickListComponent.onCancel();
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
