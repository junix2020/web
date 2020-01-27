import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
import { Component, OnInit, ViewContainerRef, AfterViewInit, Input, OnDestroy, ChangeDetectorRef, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, NgForm } from '@angular/forms';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import * as uuid from "uuid";
import { Observable } from 'rxjs';
import { filter, map, debounceTime } from 'rxjs/operators';
import { AkitaNgFormsManager } from '@datorama/akita-ng-forms-manager';
import { AreaFormsState } from '../state/area-form-state';
import { AreaClassificationDTO } from '../dto/area-classification.dto';
import { AssociatedAreaDTO } from '../dto/associated-area.dto';
import { CityAreasService } from '../services/city-areas.service';
import { CityMasterDTO } from '../dto/city-master-dto';
import { CityAreaClassificationDetailDTO } from '../dto/city-area-classification-detail.dto';
import { CityAssociatedAreaDetailDTO } from '../dto/city-associated-area-detail.dto';
import { AreaDTO } from '../dto/area.dto';
import { CityAreaFactoryService } from '../services/city-areas-factory-control.service';

@Component({
   selector: 'app-city-form',
   template: `
<!-- <pre>{{ state$ | async | json }} </pre> -->
<!-- [nzNoColon]="true" -->
<form nz-form  [nzNoColon]="true" [formGroup]="cityForm" novalidate >
   
         <nz-form-item>
            <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="areaTypeName">Area Type</nz-form-label>
            <nz-form-control [nzSm]="16" [nzXs]="24">
               <input readonly formControlName="areaTypeName" nz-input id="areaTypeName"/>
            </nz-form-control>
         </nz-form-item>

         <nz-form-item>
            <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="code">Code</nz-form-label>
            <nz-form-control [nzSm]="16" [nzXs]="24">
               <input nz-input formControlName="code" id="code" />
            </nz-form-control>
         </nz-form-item>

         <nz-form-item>
            <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="name">Display Name</nz-form-label>
            <nz-form-control [nzSm]="16" [nzXs]="24">
               <input nz-input formControlName="name" id="name"/>
            </nz-form-control>
         </nz-form-item>

            <nz-form-item>
                  <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="description">Description</nz-form-label>
                  <nz-form-control [nzSm]="16" [nzXs]="24">
                     <textarea nz-input rows="3" formControlName="description" id="description"></textarea>
                  </nz-form-control>
          </nz-form-item>

            <nz-form-item>
                <nz-form-control [nzSpan]="24" [nzOffset]="6">
                     <label nz-checkbox formControlName="permanentRecordIndicator">
                        <span>Permanent Record Indicator</span>
                     </label>
                </nz-form-control>
            </nz-form-item>
       
            <nz-form-item>
                  <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="statusName">Status</nz-form-label>
                      <nz-form-control [nzSm]="16" [nzXs]="24">
                           <div nz-row [nzGutter]="10">
                                    <div nz-col [nzSpan]="22">
                                          <input readonly nz-input formControlName="statusName" id="statusName"/>
                                    </div>
                                    <div nz-col [nzSpan]="1">
                                       <button [disabled]="isDisabled" nz-button (click)="onPickAreaStatusType()">
                                             <i nz-icon nzType="ellipsis" nzTheme="outline"></i>
                                       </button>
                                 </div>
                           </div>
                      </nz-form-control>
            </nz-form-item>

            <nz-form-item>
               <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="province">Province</nz-form-label>
                   <nz-form-control [nzSm]="16" [nzXs]="24">
                        <div nz-row [nzGutter]="10">
                                 <div nz-col [nzSpan]="22">
                                       <input nz-input readonly formControlName="provinceName" id="provinceName"/>
                                 </div>
                                 <div nz-col [nzSpan]="1">
                                       <button [disabled]="isDisabled" nz-button (click)="onPickProvince()">
                                             <i nz-icon  nzType="ellipsis" nzTheme="outline"></i>
                                       </button>
                                 </div>
                                                                  
                        </div>
                   </nz-form-control>
            </nz-form-item>

            <!-- begin ListBox display for area classifications -------------------->	
            <nz-form-item>
                     <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="classifications">
                           Classifications
                     </nz-form-label>
                     <nz-form-control [nzSm]="16" [nzXs]="24">
                           <app-jlist-box
                                 header="Area Classification"
                                 [isMsg]="isMsg"       
                                 [lists]="lists"
                                 (addClassification)="onAddClassification()" 
                                 (deleteClassification)="onDeleteClassification($event)">
                           </app-jlist-box>
                     </nz-form-control>
            </nz-form-item>
            <!-- end ListBox display for area classifications -------------------->	
                                  
            <nz-form-item>
                  <div formArrayName="areaClassifications">
                      <div *ngFor="let classifier of getClassifier.controls; let idx=index" [formGroupName]="idx"></div>
                  </div>
            </nz-form-item>

            <nz-form-item>
                <div formArrayName="associatedAreas"> 
                      <div *ngFor="let associated of getCityAreaAssociated.controls; let idx=index" [formGroupName]="idx"> </div> 
                </div> 
            </nz-form-item>
         
            <!--All hidden controls are grouped begin here -->
            <input nz-input formControlName="areaTypeAreaID" id="areaTypeAreaID" type="hidden"/> 
            <input nz-input formControlName="areaID" id="areaID" type="hidden"/>
            <input nz-input formControlName="colorID" id="colorID" type="hidden"/>
            <input nz-input formControlName="statusTypeID" id="statusTypeID" type="hidden"/>
            <input nz-input formControlName="provinceAreaID" id="provinceAreaID" type="hidden"/>
            <!--All hidden controls are grouped end here -->
         
</form>
 <!-- <pre>{{cityForm.value | json}}</pre> -->
`,
   styles: [
  
   ],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class CityFormComponent implements OnInit, AfterViewInit, OnDestroy {

// these events are called when there is and need to execute a method in the parent component
   @Output() onSave = new EventEmitter<CityMasterDTO>();  // use in New, View and Edit
   @Output() setAreaAssociated = new EventEmitter<CityAssociatedAreaDetailDTO>();   // use in cit area associated areas
   @Output() resetForm = new EventEmitter();       // use in New, View and Edit
   @Output() enableSave = new EventEmitter();      // use in View to enable toolbar save button
   @Output() disableSave = new EventEmitter();     // use in View to disable toolbar save button
   @Output() enableDelete = new EventEmitter();    // use in View and Edit to set enable delete toolbar button
   @Output() disableDelete = new EventEmitter();   // use in View and Edit to set disable delete toolbar button
   @Output() deleteProvince = new EventEmitter<string>();  // delete an existing province

// these variables received values from the parent component
   @Input() status: string;
   @Input() areaId: string;
   @Input() isMsg: boolean;
   @Input() isDisabled: boolean;

// these variables used in storing ang manipulating forms
   cityForm: FormGroup;
   forms: any;

// this variable was used in saving datas by navigating url 
    sourceData: any;

// this variable used to store data to be send to list box component
    lists: any[] = [];

// state object variable if usig navigationg url
    state$: Observable<object>;

// a variable to set flag 
   isColName: boolean = false;

// a variable that accept an array of area classification
    classification: Array<AreaClassificationDTO> = [];

// a variable that accempt an arry of area association
    associatedArea: Array<AssociatedAreaDTO> = [];

// a variable to store province id
   provinceAreaId: string;


   
// default status, new status
   statusTypeId = "0615d7a0-6d66-4171-bb6f-f37c177e0df4" // default UUID of New status
   statusTypeName = "New" // default label of status

   constructor(
      public router: Router, public activatedRoute: ActivatedRoute,
      private formsManager: AkitaNgFormsManager<AreaFormsState>, 
      private fb: FormBuilder,
      private cityAreasService: CityAreasService,
      private cityAreaFactoryService: CityAreaFactoryService,
      private ref: ChangeDetectorRef

   ) { }
 
// method to set result data from parent, this method is use when current status is either Edit and View
    setResults(params) {
      this.displayRetrievedData(params, this.isMsg);  //  call method to display data retrieved from server
      this.setDeleteToolbar();  // cal method to set toolbar delete
      this.ref.detectChanges();
    }

// method to disable delete toolbar button if status was active else enable if status was draft, this method is use when current status is either Edit and View
    setDeleteToolbar() {
        var status = this.cityForm.get('statusName').value;

        if (status.toLowerCase() == 'active') {
            this.disableDelete.emit();
        } else if (status.toLowerCase() == 'draft' || status.toLowerCase() == 'new') {
            this.enableDelete.emit();
        }
    }

// method to remove the area classifification with an assigned id, this method is use when current status is either Edit and View
   onDeleteClassification(params) {
      var item: any[];
      item = params;
      if (item.length > 0) {
          item.map(i => {
             // check if area classifier exist, then remove the area classifier in the server
             this.getClassifier.removeAt(this.getClassifier.value.findIndex(c => c.areaClassificationID === i.id));
             if (this.status.toLowerCase() == 'edit' || this.status.toLowerCase() == 'view') {
               this.cityAreasService.deleteCityAreaClassificationByID(i.id);
             }
            this.ref.detectChanges();
          })
         
      }
   }
   
// method to remove the associated area with an assigned id, this method is use when current status is either Edit and View
   deleteCityAssociatedArea(params) {
      var item: any[];
      var idx: number;
      var subjectAreaID: string;
      var provinceAreaID: string;
      item = params;
      if (item.length > 0) {
          item.map(a => {
             //check if it is a province and its a default
             // if it was exist then clear province control and remove the province in associated area 
             idx = this.getCityAreaAssociated.value.findIndex(b => b.areaAssociationID === a.areaAssociationID);
             if (idx > -1) {
               provinceAreaID = this.cityForm.get('provinceAreaID').value;
               subjectAreaID = this.getCityAreaAssociated.at(idx).get('subjectAreaID').value;
               if (provinceAreaID == subjectAreaID) {
                  this.onSetEmptyCityAssociatedAreaProvince();
               } 
             }
            // remove the area association if there is a match in id
            this.getCityAreaAssociated.removeAt(this.getCityAreaAssociated.value.findIndex(b => b.areaAssociationID === a.areaAssociationID));
            // remove the association area in the server by using the assocation id
             if (this.status.toLowerCase() == 'edit' || this.status.toLowerCase() == 'view') {
                this.cityAreasService.deleteCityAssociatedAreaByID(a.areaAssociationID);
             }
            this.ref.detectChanges();
         })
      }
       
   }

// method to remove form manager to clear null data
   onEmptyForm() {
      this.formsManager.remove('newForm');
   }

// method to save and submit city area data
   saveCityArea() {
       this.onSave.emit(this.formsManager.getForm('newForm').value);
   }

// method to reset all to default state
    formReset() {
        this.lists = null;
      // unsubscribe the previous form
        this.formsManager.unsubscribe('newForm');
        // reset city area form
        this.resetCityAreaForm();
      // create a new form, default 'newForm' state
        this.buildForm();
        this.defaultAreaClassification();
      // set city area classification list box
        this.setCityAreaClassificationList();
        this.setAssociatedArea();

    }

// method to call the event to reset a form
   resetCityAreaForm() {
      this.resetForm.emit();
   }

// method to reset the form and add new entry form
   cityAreaFormReset() {
      this.formReset();
   }
  
   ngOnInit() {
//--- for state object -------------------------------------------------//
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
//--------------------------------------------------------------------//
      this.state$.subscribe(s => {
         this.sourceData = s;
         
      })

      // call method to create a fresh form
      this.buildForm();
   }

// method after all events are executed
    ngAfterViewInit(): void {
        if (this.status.toLowerCase() == 'view') {
           this.disableSave.emit(); // set save toolbar to disable by default
        }
       // set data to associated area
       this.setAssociatedArea();
       // set city area classification list box
       this.setCityAreaClassificationList();
       // calll this method to determine which picklist was sent from state object
       this.picklistSource();                 
    }

// method to get where the picklist source
    picklistSource() {
        switch (this.sourceData.source) {
            case 'AreaClassification':
                this.onAddAreaClassification();
                break;
            case 'AreaStatusType':
                this.onAddAreaStatusType();
                break;
            case 'AssociatedArea':
                this.onAddAssociatedArea();
                break;
            case 'CityAssociatedAreaProvince':
                this.onSetCityAssociatedAreaProvince();
                this.onAddAssociatedArea();
                break;
            default:
                break;
        }

        // set associated area every time there is a picklist
        this.setAssociatedArea();

        // refresh and set the list box
        this.setCityAreaClassificationList();
    }

// method to restore data retrieved from database together with the details
    displayRetrievedData(params, isMsg) {
        var cityAreaData: any;
        cityAreaData = params.city;
        cityAreaData.areaClassifications = params.areaClassifications;
        cityAreaData.associatedAreas = params.associatedAreas;

      //this.restoreCity(cityAreaDTO);
      this.dispplayCityArea(cityAreaData);
      // check whether msg true/false to activate form
        this.setEnableDisableForm(isMsg);
      this.ref.detectChanges();
    }

// method to enable or disable the form
    setEnableDisableForm(flag: boolean) {
        if (flag == true) {
            this.cityForm.enable();
            this.isDisabled = false;
        } else if (flag == false) {
            this.cityForm.disable();
            this.isDisabled = true;
        }
    }

// method to build initial form
   buildForm() {
    
      this.cityForm = this.fb.group({
         areaTypeAreaID: ['a2fe1b0c-85fe-4daa-825c-e6d9cd683010'],
         areaTypeName: ['City'],
         areaID: [uuid.v4()],
         code: null,
         name: null,
         description: null,
         permanentRecordIndicator: false,
         colorID: null,
         statusTypeID: [this.statusTypeId],
         statusName: [this.statusTypeName],
         provinceAreaID: null,
         provinceName: null,
         areaClassifications: this.fb.array([]),
         associatedAreas: this.fb.array([])
      }),

         this.formsManager.upsert('newForm', this.cityForm, {
            arrControlFactory: { areaClassifications: this.cityAreaFactoryService.areaClassificationControl, associatedAreas: this.cityAreaFactoryService.associatedAreaControl }
         })

   }

 // method to update area associated area ag-grid
   setAssociatedArea() {
      var associatedArea: any;
      associatedArea = this.cityForm.get('associatedAreas').value;
      this.setAreaAssociated.emit(associatedArea);
   }
    
    
// method to display retrieved city into form
    dispplayCityArea(cityArea) {
       this.cityForm.patchValue({
         areaTypeAreaID: cityArea.areaTypeAreaID,
         areaTypeName: cityArea.areaTypeName,
         areaID: cityArea.areaID,
         code: cityArea.code,
         name: cityArea.name,
         description: cityArea.description,
         permanentRecordIndicator: cityArea.permanentRecordIndicator,
         colorID: cityArea.colorID,
         statusTypeID: cityArea.statusTypeID,
         statusName: cityArea.statusName,
         provinceAreaID: cityArea.provinceAreaID,
         provinceName: cityArea.provinceName

       });

      // create controls 
      this.cityForm.setControl('areaClassifications', this.setExistingAreaClassifications(cityArea.areaClassifications));
      this.cityForm.setControl('associatedAreas', this.setExistingAssociatedArea(cityArea.associatedAreas));
      // set associated area after retrieving
      this.setCityAreaClassificationList();
      this.setAssociatedArea();
      this.ref.detectChanges();
    }

 // metdhod to display the retrieved area classification detail and into the list box
   setExistingAreaClassifications(areaClassficationSets: CityAreaClassificationDetailDTO[]): FormArray {
      const formArray = new FormArray([]);
      areaClassficationSets.forEach(ac => {
         formArray.push(this.fb.group({
            areaClassificationID: ac.areaClassificationID,
            startDateTime: ac.startDateTime,
            endDateTime: ac.endDateTime,
            primaryTypeIndicator: ac.primaryTypeIndicator,
            areaID: ac.areaID,
            categoryTypeName: ac.categoryTypeName,
            categoryTypeID: ac.categoryTypeID,
            subCategoryTypeID: ac.subCategoryTypeID,
            mutuallyExclusiveIndicator: ac.mutuallyExclusiveIndicator
         }));
      });
      return formArray;
   }

// method to display the retrieved associated area detail into assocaited area grid
   setExistingAssociatedArea(associatedAreaSets: CityAssociatedAreaDetailDTO[]): FormArray {
      const formArray = new FormArray([]);
      associatedAreaSets.forEach(aa => {
         formArray.push(this.fb.group({
            areaAssociationID: aa.areaAssociationID,
            associationTypeID: aa.associationTypeID,
            associationTypeName: aa.associationTypeName,
            subjectAreaID: aa.subjectAreaID,
            subjectAreaName: aa.subjectAreaName,
            associatedAreaID: aa.associatedAreaID,
            associatedAreaName: aa.associatedAreaName,
            areaID: aa.areaID,
            areaCode: aa.areaCode,
            areaName: aa.areaName,
            areaDescription: aa.areaDescription,
            areaPermanentRecordIndicator: aa.areaPermanentRecordIndicator,
            areaStatusID: aa.areaStatusID,
            areaStatusName: aa.areaStatusName
         }));
      });
      return formArray;
   }

// method to display the area classification default
   defaultAreaClassification() {
      let formAreaClassification = this.cityForm.controls['areaClassifications'] as FormArray;
        let areaClassification = this.fb.group({
          areaClassificationID: uuid.v4(),
          startDateTime: new Date(),
          endDateTime: null,
          primaryTypeIndicator: null,
          areaID: this.cityForm.get('areaID').value,
          categoryTypeName: this.cityForm.get('areaTypeName').value,
          categoryTypeID: this.cityForm.get('areaTypeAreaID').value,
          subCategoryTypeID: null,
          mutuallyExclusiveIndicator: null

        });
      // insert new record 
      formAreaClassification.push(areaClassification);
   }

// add new area classification
   onAddAreaClassification(): void {
      var name: string;
      var categoryTypeId: string;
      var subCategoryTypeId: string;
      var mutuallyExclusiveIndicator: string;
      var idx: number;

// do nothing if source id is undefined
      if (this.sourceData.categoryTypeID == undefined) {
         return;
      }

      name = this.sourceData.name;
      categoryTypeId = this.sourceData.categoryTypeID;
      subCategoryTypeId = this.sourceData.subCategoryTypeID;
      mutuallyExclusiveIndicator = this.sourceData.mutuallyExclusiveIndicator;

      // check if the record exist and ignore to avoid duplicate
      idx = this.getClassifier.value.findIndex(i => i.categoryTypeID === categoryTypeId);
      if (idx > -1) {
         return;
      }
      // assign default value in area classification
      let areaClassifications = this.cityForm.controls['areaClassifications'] as FormArray;
         let areaClassification = this.fb.group({
            areaClassificationID: uuid.v4(),
            startDateTime: new Date(),
            endDateTime: null,
            primaryTypeIndicator: null,
            areaID: this.cityForm.get('areaID').value,
            categoryTypeName: name,
            categoryTypeID: categoryTypeId,
            subCategoryTypeID: subCategoryTypeId,
            mutuallyExclusiveIndicator: mutuallyExclusiveIndicator
         });
         // insert new record here and refresh the display of the list
         areaClassifications.push(areaClassification);
   }

// method to add new assocaited area
   onAddAssociatedArea(): void {
      var subjectAreaID: string;
      var subjectAreaName: string;;
      var associatedAreaID: string;
      var associatedAreaName: string;
      var idx: number;

// if there is no id from source do nothing 
      if (this.sourceData.areaID == undefined) {
         return;
      }
// check source if its from area province
      if (this.sourceData.source == 'CityAssociatedAreaProvince') {
         subjectAreaID = this.cityForm.get('provinceAreaID').value;
         subjectAreaName = this.cityForm.get('provinceName').value;
         associatedAreaID = this.cityForm.get('areaID').value;
         associatedAreaName = this.cityForm.get('name').value;
      } else {
         subjectAreaID = this.cityForm.get('areaID').value;
         subjectAreaName = this.cityForm.get('name').value;
         associatedAreaID = this.sourceData.areaID;
         associatedAreaName = this.sourceData.name;
      }

       // find existing area id in city associated area if match found, return and do nothing
       idx = this.getCityAreaAssociated.value.findIndex(a => a.areaID === this.sourceData.areaID);
       if (idx > -1) {  // check if associated area exists and return do nothing to avoid duplication
           return;
       } else if (this.provinceAreaId != null && (this.sourceData.areaID != this.provinceAreaId)) { // delete existing area id if replaced with new  id
           this.deleteProvince.emit(this.provinceAreaId);  // emit an event to delete existing province
       }

      // insert or add new record into associated area array
      let associatedAreas = this.cityForm.controls['associatedAreas'] as FormArray;
      let associatedArea = this.fb.group({
         areaAssociationID: uuid.v4(),
         associationTypeID: this.sourceData.associationTypeID,
         associationTypeName: this.sourceData.associationType,
         subjectAreaID: subjectAreaID,
         subjectAreaName: subjectAreaName,
         associatedAreaID: associatedAreaID,
         associatedAreaName: associatedAreaName,
         areaID: this.sourceData.areaID,
         areaCode: this.sourceData.code,
         areaName: this.sourceData.name,
         areaDescription: this.sourceData.description,
         areaPermanentRecordIndicator: '',
         areaStatusID: this.sourceData.statusTypeID,
         areaStatusName: this.sourceData.statusName,
      });
      // push new record to associated area
      associatedAreas.push(associatedArea);

   }

// method getter to return a cast as form array area classication into control
   get getClassifier(): FormArray {
      return this.cityForm.get('areaClassifications') as FormArray;
   }

// method getter to return a cast as form array associated area into control
   get getCityAreaAssociated(): FormArray {
      return this.cityForm.get('associatedAreas') as FormArray;
   }

// method to set the listbox display category name and id(s)
   setCityAreaClassificationList() {
      var listOfData: any[] = [];
      
      this.classification = this.cityForm.get('areaClassifications').value;
         if (this.classification.length > 0) {
            this.classification.map(c => {
               listOfData = [
                  ...listOfData,
                  { name: c.categoryTypeName, id: c.areaClassificationID }
               ]
            })
         }
      this.setValues(listOfData);
      
   }

// method to assign value(s) area classification in list box
  setValues(params) {
      this.lists = params;
  }

// method to set city empty associated area province into cityForm control
   onSetEmptyCityAssociatedAreaProvince() {
      this.cityForm.get('provinceAreaID').patchValue(null);
      this.cityForm.get('provinceName').patchValue(null);
   }

// method to set city associated area province into cityForm control
   onSetCityAssociatedAreaProvince() {
       if (this.sourceData.areaID == undefined) {
           return;
       }
       // save the old province area id
       this.provinceAreaId = this.cityForm.get('provinceAreaID').value;
       // set new value into province field
       this.cityForm.get('provinceAreaID').patchValue(this.sourceData.areaID);
       this.cityForm.get('provinceName').patchValue(this.sourceData.name);
   }

// method to set area status into control
   onAddAreaStatusType() {
// check if the id is valid else do nothing
      if (this.sourceData.associatedStatusTypeID == undefined) {
         return;
      }
    // assign values to status control
      this.cityForm.get('statusTypeID').patchValue(this.sourceData.associatedStatusTypeID);
      this.cityForm.get('statusName').patchValue(this.sourceData.associatedStatusTypeName);
   }

// method to call area classification picklist using the navigation url
   onAddClassification() {
      var subCategories: any[] = [];
       this.classification = this.cityForm.get('areaClassifications').value;
      // get all ids and indicator
      if (this.classification.length > 0) {
         this.classification.map(s => {
            if (s.subCategoryTypeID != null) {
               subCategories = [
                  ...subCategories,
                  { categoryTypeID: s.categoryTypeID, subCategoryTypeID: s.subCategoryTypeID, mutuallyExclusiveIndicator: s.mutuallyExclusiveIndicator }
               ]
            }
         })
      }
       if (this.status.toLowerCase() == 'edit' || this.status.toLowerCase() == 'view' || this.status.toLowerCase() == 'new') {
           this.router.navigateByUrl('/common-objects/place/area/political-area/city/areaclassification-picklist', { state: { subCategories } });
       } 
   }

// method to call area status type picklist using the navigating url
   onPickAreaStatusType() {
      this.statusTypeId = this.cityForm.get('statusTypeID').value;

       if (this.status.toLowerCase() == 'edit' || this.status.toLowerCase() == 'view') {
           this.router.navigateByUrl('/common-objects/place/area/political-area/city/area-status-type-picklist', { state: { statusTypeId: this.statusTypeId } });
           
       } else {
         this.router.navigateByUrl('/common-objects/place/area/political-area/city/area-status-type-picklist', { state: { statusTypeId: this.statusTypeId } });
       }
      
   }

// method to call province picklist using the navigating url
   onPickProvince() {
      var associationType: string = 'Subsidiary Association Type';
      var associationTypeID: string = '2160dcca-eb32-4ea6-a161-f5b9f7d83f42';

       if (this.status.toLowerCase() == 'edit' || this.status.toLowerCase() == 'view') {
         this.router.navigateByUrl('/common-objects/place/area/political-area/city/city-associated-area-province-picklist', { state: { associationType: associationType, associationTypeID: associationTypeID, message: this.status, areaId: this.areaId, enable: true } });   // you can call component without state object.
       } else {
         this.router.navigateByUrl('/common-objects/place/area/political-area/city/city-associated-area-province-picklist', { state: { associationType: associationType, associationTypeID: associationTypeID } });   // you can call component without state object.
       }
      
   }

 // method to unsubscribe the form state when no longer used
   ngOnDestroy() {
     this.formsManager.unsubscribe('newForm');
   
   }

     
} // CityFormCompoent end brace pair

