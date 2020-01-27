import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { PersonsFormComponent } from '../components/persons-form.component';
import { Subject, Observable } from 'rxjs';
import { Toolbar, ToolbarItemType, ToolbarType, NewFormToolbars } from '../../../shell';
import { Router, ActivatedRoute } from '@angular/router';
import { map, takeUntil } from 'rxjs/operators';
import { PartiesService } from '../services/parties.service';
import { PartiesCommonService } from '../services/parties-common.service';

@Component({
  selector: 'app-persons-new-page',
  template: `
 <!-- <pre> {{ state$ | async | json }} </pre>  -->
<div class="persons-form">
      <nz-collapse>
            <nz-collapse-panel 
                  nzHeader="New Person"
                  [nzDisabled]="false"
                  [nzActive]="true"
                  [nzShowArrow]="false">
                  <app-persons-form
                     [status]="status"
                     [isMsg]="isMsg"
                     [isDisabled]="isDisabled"
                     (setAreaAssociated)="setAssociated($event)"
                     (onSave)="onSave($event)"
                     (resetForm)="onEmptyForm()"
                     (deleteProvince)="onDeleteProvince($event)"
                     >
                  </app-persons-form>
            </nz-collapse-panel>
      </nz-collapse>
      
      
 </div>
  `,
   styles: [],
   changeDetection: ChangeDetectionStrategy.OnPush 

})
export class PersonsNewPageComponent implements OnInit, OnDestroy, AfterViewInit {
  // view child decorator with child components
   @ViewChild(PersonsFormComponent, { static: false }) personsFormComponent: PersonsFormComponent;

// a variable to destroy the observable
    destroy$ = new Subject();

// all needed variables
   status: string;
   isDisabled: boolean = false;
   isMsg: boolean;
   partyId: string;
   flag: boolean;
   state$: Observable<object>;
  sourceData: any;
  picklistName: string;
  itemsParse: any[];

   constructor(
      private toolbar: Toolbar,
      private router: Router,
      private route: ActivatedRoute,
      private partiesService: PartiesService,
      private partiesCommonService: PartiesCommonService,
      public activatedRoute: ActivatedRoute,
      private ref: ChangeDetectorRef
   ) { }
   
    ngOnInit() {
      //set flag to enable form
        this.isMsg = true;

      //  this.state$ = this.activatedRoute.paramMap.pipe(
      //      map(() => window.history.state)
      //  );
      //this.state$.subscribe(s => {
      //  var stringParse: any;
      //  stringParse = JSON.parse(JSON.stringify(s));
      //  try {
      //    this.picklistName = stringParse.source;
      //    console.log('pick name ', this.picklistName);
      //    if (stringParse.items.length > 0) {
      //      this.itemsParse = stringParse.items;
      //      console.log('item parse ', this.itemsParse);
      //    }
      //  }  catch (e) { }
      //});
        // get the current status from the service ex. New, Edit and View
        this.status = this.getPersonStatus();
        if (this.status == null) {
            this.status = 'New';
            this.partiesCommonService.setStatus({ status: this.status });
        }

        this.toolbar.clicked$
         .pipe(takeUntil(this.destroy$))
         .subscribe(type => this.onToolbarItemClicked(type));
        this.toolbar.load(...NewFormToolbars());

        // get the current flag from serive
        this.flag = this.getFlagStatus();

        // set flag to clear the form and execute the city area form reset method
        if (!this.flag) {
            // call the reset method to initialize the form
            this.personsFormComponent.personFormReset();
            // set the current flag to true indicates that form reset should be executed at one time only
            this.partiesCommonService.setPartyFlag({ flag: true });
        } else if (this.flag) {
            // check if it is from picklist source customer party set toolbar save to enable
          //if (this.sourceData.source != undefined || this.sourceData.source != null) {
          //  console.log('souce data ', this.sourceData.source);
          //      this.isMsg = true;
          //      //this.onSetAssocaitedAreaViewEdit();
          //  }
        }
   
    }

    ngAfterViewInit() {
    }

// method to call the toolbar type
   onToolbarItemClicked(type: ToolbarItemType) {
      
      switch (type) {

         case ToolbarType.Save:
            this.personsFormComponent.savePerson();
              break;

         case ToolbarType.New:
            this.personsFormComponent.personFormReset();
              break;

          case ToolbarType.Close:
              this.partiesCommonService.setPartyId({ partyID: this.partyId });
              const url = window.location.pathname;
              var newUrl = url.slice(0, url.search('new') - 1);
                      
              this.router.navigate([newUrl]);
              break;
      }
    
   }

  // method to get the retieve flag status
    getFlagStatus(): boolean {
        var flag: boolean;
        this.partiesCommonService.flag$.subscribe(f => {
            flag = f.flag;
        });
        return flag;
    }

// method to get the saved booking batch id
    getPersonId(): string {
        var partyId: string;
        this.partiesCommonService.party$.subscribe(a => {
            partyId = a.partyID;
        })
        return partyId;
    }

// method to get the status from the service
    getPersonStatus(): string {
        var status: string;
        this.partiesCommonService.status$.subscribe(s => {
            status = s.status;
        })
        return status;
    }

// method to set enable or disable associated area
    onSetAssocaitedAreaViewEdit() {
        //this.status = 'New'
        //this.cityFormComponent.status = this.status;
        //this.cityAssociatedComponent.isMsg = true;
        //this.cityAssociatedComponent.status = 'Edit';
        //this.cityAreaCommonService.setStatus({ status: this.status });
        //this.cityAssociatedComponent.activateButton();
    }

// method to call the service to save the data
   onSave(event): void {
       this.partyId = event.partyID;
       // set a new person party id in the service
     this.partiesCommonService.setPartyId({ partyID: this.partyId });
     this.partiesService.savePerson(event, this.getPersonStatus().toLowerCase());
   }

// method to set data in associated area grid
   setAssociated(params) {
      //this.cityAssociatedComponent.setGridData(params);
      //this.ref.detectChanges();
   }

// method to delete existing province
    onDeleteProvince(param) {
        //this.cityAssociatedComponent.provinceAreaId = param;
    }

// method to delete city associatied area
    deleteAssociatedArea(params) {
        //this.cityFormComponent.deleteCityAssociatedArea(params);
    }

// method to empty child component form
   onEmptyForm() {
      this.personsFormComponent.onEmptyForm();
   }

// method to destroy the observable
   ngOnDestroy() {
      this.destroy$.next();
      this.destroy$.complete();
      
   }
   
}
