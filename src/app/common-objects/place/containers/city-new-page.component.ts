import { OnInit, Component, ViewChild, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import {
  OnToolbarItemClick,
  Toolbar,
  ToolbarItemType,
  ToolbarType,
  cityAreaNewFormToolbars
} from '@web/shell';
import { takeUntil, debounceTime, map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { navigateUp } from '../../../util/navigateUp';
import { CityFormComponent } from '../components/city-form.component';
import { CityAreasService } from '../services/city-areas.service';
import { CityAssociatedAreaListFormComponent } from '../components/city-associated-area-list-form.component';
import { CityAreaCommonService } from '../services/city-area-common-service';

@Component({
  selector: 'app-city-new-page',
   template: `
<div class="city-form">
      <nz-collapse>
            <nz-collapse-panel 
                  nzHeader="New City"
                  [nzDisabled]="false"
                  [nzActive]="true"
                  [nzShowArrow]="false">
                  <app-city-form
                     [status]="status"
                     [isMsg]="isMsg"
                     [isDisabled]="isDisabled"
                     (setAreaAssociated)="setAssociated($event)"
                     (onSave)="onSave($event)"
                     (resetForm)="onEmptyForm()"
                     (resetForm)="onEmptyForm()"
                     (deleteProvince)="onDeleteProvince($event)"
                     >
                  </app-city-form>
            </nz-collapse-panel>
      </nz-collapse>
      
      <nz-collapse>
        <nz-collapse-panel
                  nzHeader="Associated Areas"
                  [nzActive]="true"
                  [nzShowArrow]="true">
                  <city-associated-area-listform
                  [status]="status"
                  (deleteAreaAssociated)="deleteAssociatedArea($event)"
                  >
                  </city-associated-area-listform> 
            </nz-collapse-panel>
      </nz-collapse>
 </div>
  `,
   styles: [],
   changeDetection: ChangeDetectionStrategy.OnPush 

})
export class CityNewPageComponent implements OnInit, OnDestroy, AfterViewInit {
// view child decorator with child components
   @ViewChild(CityFormComponent, { static: false }) cityFormComponent: CityFormComponent;
   @ViewChild(CityAssociatedAreaListFormComponent, { static: false }) cityAssociatedComponent: CityAssociatedAreaListFormComponent;

// a variable to destroy the observable
    destroy$ = new Subject();

// all needed variables
   status: string;
   isDisabled: boolean = false;
   isMsg: boolean;
   areaId: string;
   flag: boolean;
   state$: Observable<object>;
   sourceData: any;

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
      //set flag to enable form
        this.isMsg = true;

        this.state$ = this.activatedRoute.paramMap.pipe(
            map(() => window.history.state)
        );
        this.state$.subscribe(s => {
            this.sourceData = s;

        })
        // get the current status from the service ex. New, Edit and View
        this.status = this.getCityAreaStatus();
        if (this.status == null) {
            this.status = 'New';
            this.cityAreaCommonService.setStatus({ status: this.status });
        }

        this.toolbar.clicked$
         .pipe(takeUntil(this.destroy$))
         .subscribe(type => this.onToolbarItemClicked(type));
        this.toolbar.load(...cityAreaNewFormToolbars());

        // get the current flag from serive
        this.flag = this.getFlagStatus();

        // set flag to clear the form and execute the city area form reset method
        if (!this.flag) {
            // call the reset method to initialize the form
            this.cityFormComponent.cityAreaFormReset();
            // set the current flag to true indicates that form reset should be executed at one time only
            this.cityAreaCommonService.setCityAreaFlag({ flag: true });
        } else if (this.flag) {
            // check if it is from picklist source customer party set toolbar save to enable
            if (this.sourceData.source != undefined || this.sourceData.source != null) {
                this.isMsg = true;
                this.onSetAssocaitedAreaViewEdit();
            }
        }
   
    }

    ngAfterViewInit() {
    }

// method to call the toolbar type
   onToolbarItemClicked(type: ToolbarItemType) {
      
      switch (type) {

         case ToolbarType.cityAreaNewSave:
            this.cityFormComponent.saveCityArea();
              break;

         case ToolbarType.cityAreaNewAdd:
            this.cityFormComponent.cityAreaFormReset();
              break;

          case ToolbarType.cityAreaNewClose:
              this.cityAreaCommonService.setCityAreaId({ areaID: this.areaId });
              const url = window.location.pathname;
              var newUrl = url.slice(0, url.search('new') - 1);
                      
              this.router.navigate([newUrl]);
              break;
      }
    
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

// method to set enable or disable associated area
    onSetAssocaitedAreaViewEdit() {
        this.status = 'New'
        this.cityFormComponent.status = this.status;
        this.cityAssociatedComponent.isMsg = true;
        this.cityAssociatedComponent.status = 'Edit';
        this.cityAreaCommonService.setStatus({ status: this.status });
        this.cityAssociatedComponent.activateButton();
    }

// method to call the service to save the data
   onSave(event): void {
       this.areaId = event.areaID;
       // set a new booking batch id in the service
       this.cityAreaCommonService.setCityAreaId ({ areaID: this.areaId });
       this.cityAreasService.saveCityArea(event, this.getCityAreaStatus().toLowerCase());
   }

// method to set data in associated area grid
   setAssociated(params) {
      this.cityAssociatedComponent.setGridData(params);
      this.ref.detectChanges();
   }

// method to delete existing province
    onDeleteProvince(param) {
        this.cityAssociatedComponent.provinceAreaId = param;
    }

// method to delete city associatied area
    deleteAssociatedArea(params) {
        this.cityFormComponent.deleteCityAssociatedArea(params);
    }

// method to empty child component form
   onEmptyForm() {
      this.cityFormComponent.onEmptyForm();
   }

// method to destroy the observable
   ngOnDestroy() {
      this.destroy$.next();
      this.destroy$.complete();
      
   }
   
}
