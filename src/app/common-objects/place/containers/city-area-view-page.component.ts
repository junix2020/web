import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CityFormComponent } from '../components/city-form.component';
import { CityAssociatedAreaListFormComponent } from '../components/city-associated-area-list-form.component';
import { Toolbar, cityAreaViewFormToolbars, ToolbarItemType, ToolbarType } from '../../../shell';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { CityAreasService } from '../services/city-areas.service';
import { map, takeUntil, filter } from 'rxjs/operators';
import { navigateUp } from '../../../util/navigateUp';
import { CityAreaCommonService } from '../services/city-area-common-service';


@Component({
   selector: 'city-area-view-page',
   template:
      `
 <!-- <pre>{{ state$ | async | json }} </pre> -->
 <div class="city-area-view-form">
      <nz-collapse>
            <nz-collapse-panel 
                  nzHeader="View City"
                  [nzDisabled]="false"
                  [nzActive]="true"
                  [nzShowArrow]="false">
           <!-- <ng-container *ngIf="(cityArea$ | async) as cityArea"> -->
                  <app-city-form
                     [areaId]="areaId"
                     [status]="status"
                     [isMsg]="isMsg"
                     (setAreaAssociated)="setAssociated($event)"
                     (onSave)="onSave($event)"
                     (enableDelete)="onEnableDelete()"
                     (disableDelete)="onDisableDelete()"
                     (enableSave)="onEnableSave()"
                     (disableSave)="onDisableSave()"
                     (resetForm)="onEmptyForm()"
                     (deleteProvince)="onDeleteProvince($event)"
                     >
                  </app-city-form>
            <!-- </ng-container> -->
            </nz-collapse-panel>
      </nz-collapse>
      
      <nz-collapse>
        <nz-collapse-panel
                  nzHeader="Associated Areas"
                  [nzActive]="true"
                  [nzShowArrow]="true">
                  <city-associated-area-listform
                     [status]="status"
                     [areaId]="areaId"
                     [isMsg]="isMsg"
                     (deleteAreaAssociated)="deleteAssociatedArea($event)"
                     >
                  </city-associated-area-listform>
            </nz-collapse-panel>
      </nz-collapse>
   </div>
`
})
export class CityAreaViewPageComponent implements OnInit, AfterViewInit, OnDestroy {
// all variables needed
   cityArea$: Observable<any>;
   status: string;
   private sub: any;
   areaId: string;
   state$: Observable<object>;
   sourceData: any;
   isMsg: boolean;

// a variable to destroy the observable
    destroy$ = new Subject();

// a view child decorator with child components
   @ViewChild(CityFormComponent, { static: false }) cityFormComponent: CityFormComponent;
   @ViewChild(CityAssociatedAreaListFormComponent, { static: false }) cityAssociatedComponent: CityAssociatedAreaListFormComponent;

   constructor(
      private toolbar: Toolbar,
      private router: Router,
      private route: ActivatedRoute,
      private cityAreasService: CityAreasService,
      private cityAreaCommonService: CityAreaCommonService,
      public activatedRoute: ActivatedRoute,
      private ref: ChangeDetectorRef
    ) { }

   ngOnInit() {
    // set flag to disable form
       this.isMsg = false;

       // get area Id form the serive and assign it to property
       this.areaId = this.getCityAreaId(); // get area id from the service

       this.status = this.getCityAreaStatus();
       if (this.status == null) {
           this.status = 'View';
           this.cityAreaCommonService.setStatus({ status: this.status });
       }
              
    // for state object
      this.state$ = this.router.events.pipe(
         filter(e => e instanceof NavigationStart),
         map(() => {
            const currentNav = this.router.getCurrentNavigation();
            return currentNav.extras.state;
         })
      );
      this.state$ = this.activatedRoute.paramMap.pipe(
         map(() => window.history.state)
      );
      this.state$.subscribe(s => {
         this.sourceData = s;
      
      })

      this.toolbar.clicked$
         .pipe(takeUntil(this.destroy$))
         .subscribe(type => this.onToolbarItemClicked(type));
      this.toolbar.load(...cityAreaViewFormToolbars());

      // if flag was set to true don't retrieve again the booking batch 
       if (this.getFlagStatus()) {
           // check if it is from picklist source customer party set toolbar save to enable
           if (this.sourceData.source != undefined || this.sourceData.source != null) {
               this.isMsg = true;
               this.onEnableSave();
               this.cityFormComponent.setDeleteToolbar();
               this.cityFormComponent.setEnableDisableForm(this.isMsg);
               this.onSetAssocaitedAreaViewEdit();
           }
           // if flag is false do the first retrieve booking batch from the server
       } else {
           //this.bookingBatchId = this.getBookingBatchId(); // get passed booking batch id from the service
           this.cityArea$ = this.cityAreasService.getCityAreaByID(this.areaId); // call the service to retrieve data from server
           // subscribe the the booking batch then set the result to display in the form
           this.cityArea$.subscribe(res => {
               this.cityFormComponent.setResults(res);
           })

           // set flag to true to indicate data should be retrieved once
           this.cityAreaCommonService.setCityAreaFlag({ flag: true });
       }
   }

   ngAfterViewInit() {
  
   }

// method to remove the existing province
    onDeleteProvince(param) {
        this.cityAssociatedComponent.provinceAreaId = param;
    }

// method to remove associated area(s)
   deleteAssociatedArea(params) {
      this.cityFormComponent.deleteCityAssociatedArea(params);
   }

// method to set assocaited area grid 
   setAssociated(params) {
      this.cityAssociatedComponent.setGridData(params);
      this.ref.detectChanges();
   }

// method to call the service to save data
   onSave(event): void {
       this.areaId = event.areaID;
       // set a new booking batch id in the service
       this.cityAreaCommonService.setCityAreaId({ areaID: this.areaId });
       this.cityAreasService.saveCityArea(event, this.getCityAreaStatus().toLowerCase());
   }

// method to get the retieve flag status
    getFlagStatus(): boolean {
        var flag: boolean;
        this.cityAreaCommonService.flag$.subscribe(f => {
            flag = f.flag;
        });
        return flag;
    }

// method to get the saved booking batch id
    getCityAreaId(): string {
        var areaId: string;
        this.cityAreaCommonService.cityArea$.subscribe(a => {
            areaId = a.areaID;
        })
        return areaId;
    }

// method to get the status from the service
    getCityAreaStatus(): string {
        var status: string;
        this.cityAreaCommonService.status$.subscribe(s => {
            status = s.status;
        })
        return status;
    }

// method to call the toolbar item type
   onToolbarItemClicked(type: ToolbarItemType) {
      var status: string;
      var activity: string;
      switch (type) {
          case ToolbarType.cityAreaViewEdit:
              this.isMsg = true;
              this.cityFormComponent.setEnableDisableForm(this.isMsg);
              this.onEnableSave();
              this.onSetAssocaitedAreaViewEdit();
              break;

         case ToolbarType.cityAreaViewSave:
              this.cityFormComponent.saveCityArea();
            break;

          case ToolbarType.cityAreaViewDelete:
              this.cityAreasService.deleteCityAreaByID(this.areaId);
              this.cityAreaCommonService.setCityAreaId({ areaID: null });
              this.cityFormComponent.cityAreaFormReset();
              this.cityAreasService.sendNotification('Record successfully deleted!');
              break;
         case ToolbarType.cityAreaViewClose:
            const url = window.location.pathname;
            var newUrl = url.slice(0, url.search('view') - 1);
            this.router.navigateByUrl(newUrl);
            break;
      }

   }

// method to enable toolbar delete
    onEnableDelete() {
        this.toolbar.enable(ToolbarType.cityAreaViewDelete);
    }

 // method to disable toolbar delete
    onDisableDelete() {
        this.toolbar.disable(ToolbarType.cityAreaViewDelete);
    }

// method to enable toolbar save
    onEnableSave() {
        this.toolbar.enable(ToolbarType.cityAreaViewSave);
    }

// method to disable toolbar save
    onDisableSave() {
        this.toolbar.disable(ToolbarType.cityAreaViewSave);
    }

// method to empty the form if delete toolbar was clicked
    onEmptyForm() {
        this.cityFormComponent.onEmptyForm();
    }

// method to set the associated area to editable or non editable
    onSetAssocaitedAreaViewEdit() {
      this.status = 'View'
      this.cityFormComponent.status = this.status;
      this.cityAssociatedComponent.isMsg = true;
      this.cityAssociatedComponent.status = 'Edit';
      this.cityAreaCommonService.setStatus({ status: this.status });
      this.cityAssociatedComponent.activateButton();
    }

// method to unsubscribe the observable
   ngOnDestroy() {
      this.destroy$.next();
      this.destroy$.complete();
   }
}
