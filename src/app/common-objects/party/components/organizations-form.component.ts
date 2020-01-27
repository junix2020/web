import { Component, ChangeDetectionStrategy, OnInit, AfterViewInit, OnDestroy, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { OrganizationFormDTO } from '../dtos/organizations-form.dto';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { AkitaNgFormsManager } from '@datorama/akita-ng-forms-manager';
import { PartiesFormState } from '../states/parties-form-state';
import { PartiesService } from '../services/parties.service';
import { PartiesFactoryService } from '../services/parties-factory.service';
import { filter, map } from 'rxjs/operators';
import * as uuid from "uuid";
import { PartiesClassificationDTO } from '../dtos/parties-classification.dto';
import { PartiesCommonService } from '../services/parties-common.service';

@Component({
  selector: 'app-organizations-form',
  template: `
<!-- <pre> {{ state$ | async | json }} </pre> -->
<!-- [nzNoColon]="true" -->
<form nz-form  [nzNoColon]="true" [formGroup]="organizationForm" novalidate >
   
         <nz-form-item>
            <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="organizationCategoryTypeName">Party Type</nz-form-label>
            <nz-form-control [nzSm]="16" [nzXs]="24">
               <input readonly formControlName="organizationCategoryTypeName" nz-input id="organizationCategoryTypeName"/>
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
            <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="officialName">Official Name</nz-form-label>
            <nz-form-control [nzSm]="16" [nzXs]="24">
               <input nz-input formControlName="officialName" id="officialName"/>
            </nz-form-control>
         </nz-form-item>

         <nz-form-item>
             <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="creationDate">Creation Date</nz-form-label>
                <nz-form-control [nzSm]="16" [nzXs]="24">
                    <nz-date-picker input="date" [nzFormat] formControlName="creationDate" id="creationDate"></nz-date-picker>
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
                                       <button [disabled]="isDisabled" nz-button (click)="onPickStatusType()">
                                             <i nz-icon nzType="ellipsis" nzTheme="outline"></i>
                                       </button>
                                 </div>
                           </div>
                      </nz-form-control>
            </nz-form-item>

             <!-- begin ListBox display for person occupations -------------------->	
            <nz-form-item>
                <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="occupations">
                         Business
                  </nz-form-label> 
                     <nz-form-control [nzSm]="16" [nzXs]="24"> 
                           <app-jlist-box  
                                 header="Organization Business" 
                                 [isMsg]="isMsg"       
                                 [lists]="lists"  
                                 (addClassification)="onAddClassification()" 
                                 (deleteClassification)="onDeleteClassification($event)"> 
                           </app-jlist-box> 
                     </nz-form-control> 
            </nz-form-item>
            <!-- end ListBox display for person occupations -------------------->	
              
            <nz-form-item>
                  <div formArrayName="classifications">
                      <div *ngFor="let classifier of getClassifier.controls; let idx=index" [formGroupName]="idx"></div>
                  </div>
            </nz-form-item>

            <!--All hidden controls group begin here -->
            <input nz-input formControlName="organizationCategoryTypeID" id="organizationCategoryTypeID" type="hidden"/> 
            <input nz-input formControlName="partyID" id="partyID" type="hidden"/>
            <input nz-input formControlName="colorID" id="colorID" type="hidden"/>
            <input nz-input formControlName="statusTypeID" id="statusTypeID" type="hidden"/>
            <!--All hidden controls group end here -->
         
</form>
<!-- <pre>{{organizationForm.value | json}}</pre> -->
`,
  styles: [

  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganizationsFormComponent implements OnInit, AfterViewInit, OnDestroy {

  // these events are called when there is and need to execute a method in the parent component
  @Output() onSave = new EventEmitter<OrganizationFormDTO>();  // use in New, View and Edit
  @Output() resetForm = new EventEmitter();       // use in New, View and Edit
  @Output() enableSave = new EventEmitter();      // use in View to enable toolbar save button
  @Output() disableSave = new EventEmitter();     // use in View to disable toolbar save button
  @Output() enableDelete = new EventEmitter();    // use in View and Edit to set enable delete toolbar button
  @Output() disableDelete = new EventEmitter();   // use in View and Edit to set disable delete toolbar button
  @Output() edit = new EventEmitter();

  // these variables received values from the parent component
  @Input() status: string;
  @Input() partyId: string;
  @Input() isMsg: boolean;
  @Input() isDisabled: boolean;

  // these variables used in storing ang manipulating forms
  organizationForm: FormGroup;
  forms: any;
  sourceParty: string;

  // this variable was used in saving datas by navigating url 
  itemsParse: any[];
  picklistName: string;

  // this variable used to store data to be send to list box component
  lists: any[] = [];

  // state object variable if usig navigationg url
  state$: Observable<object>;

  // a variable to set flag 
  isColName: boolean = false;

  // a variable that accept an array of area classification
  classifications: any[] = [];

  // default status, new status
  statusTypeId = "a0cee29f-d748-4c9f-aee9-8e383d0777f9" // default UUID of New status
  statusTypeName = "New" // default label of status

  constructor(
    public router: Router, public activatedRoute: ActivatedRoute,
    private formsManager: AkitaNgFormsManager<PartiesFormState>,
    private fb: FormBuilder,
    private partiesService: PartiesService,
    private partiesCommonService: PartiesCommonService,
    private partiesFactoryService: PartiesFactoryService,
    private ref: ChangeDetectorRef

  ) { }

  // method to set result and display data from parent, this method is use when current status is either Edit and View
  setResults(params) {
    this.displayRetrievedData(params, this.isMsg);  //  call method to display data retrieved from server
    this.setDeleteToolbar();  // call method to set toolbar delete
    this.ref.detectChanges();
  }

  // method to disable delete toolbar button if status was active else enable if status was draft, this method is use when current status is either Edit and View
  setDeleteToolbar() {
    var status = this.organizationForm.get('statusName').value;

    if (status.toLowerCase() == 'active') {
      this.disableDelete.emit();
    } else if (status.toLowerCase() == 'draft' || status.toLowerCase() == 'new') {
      this.enableDelete.emit();
    }
  }

  // method to remove the area classifification with an assigned ids, this method is use when current status is either Edit and View
  onDeleteClassification(params) {
    var items: any[];
    items = params;
    var ids = [];
    try {
      if (items.length > 0) {
        items.map(i => {
          // check if area classifier exist, then remove the area classifier in the server
          this.getClassifier.removeAt(this.getClassifier.value.findIndex(c => c.partyClassificationID === i.id));
          ids.push(i.id);
        })
        this.partiesService.deletePartyClassificationByIDs(ids);
        this.ref.detectChanges();
      }
    } catch (e) { }
  }

  // method to remove form manager to clear null data
  onEmptyForm() {
    this.formsManager.remove('organizationsForm');
  }

  // method to save and submit city area data
  saveOrganization() {
    this.onSave.emit(this.formsManager.getForm('organizationsForm').value);
  }

  // method to reset all to default state
  formReset() {
    this.lists = null;
    // unsubscribe the previous form
    this.formsManager.unsubscribe('organizationsForm');
    // reset organization form
    this.resetPersonForm();
    // create a new form, default 'newForm' state
    this.buildForm();
  }

  // method to call the event to reset a form
  resetPersonForm() {
    this.resetForm.emit();
  }

  // method to reset the form and add new entry form
  organizationFormReset() {
    this.formReset();
  }

  ngOnInit() {
    this.sourceParty = 'organization';
     
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
      var stringParse: any;
      stringParse = JSON.parse(JSON.stringify(s));

      try {
        this.picklistName = stringParse.source;
        if (stringParse.items.length > 0) {
          this.itemsParse = stringParse.items
        }
      } catch (e) {
      }
    })

    // call method to create a fresh form
    this.buildForm();
  }

  // method after all events are executed
  ngAfterViewInit(): void {
    if (this.status.toLowerCase() == 'view') {
      this.disableSave.emit(); // set save toolbar to disable by default
    }
    // calll this method to determine which picklist was the source
    this.picklistSource();
  }

  // method to get where the picklist source
  picklistSource() {
    var toggleName = this.getToggleName();

    switch (this.picklistName) {
      case 'Classifications':
        if (toggleName == 'Edit') {
          this.edit.emit();
        }
        this.onAddPartiesClassifcation(this.itemsParse);
        break;
      case 'Status':
        if (toggleName == 'Edit') {
          this.edit.emit();
        }
        this.onUpdateOrganizationStatus(this.itemsParse);
        break;
      default:
        break;
    }
    // refresh and set the list box
    this.setPartiesClassificationList();
  }

  // method to restore data retrieved from database together with the details
  displayRetrievedData(params, isMsg) {
    var organization: any;
    organization = params.organization;
    organization.classifications = params.classifications;

    this.displayOrganization(organization);
    // check whether msg true/false to activate form
    this.setEnableDisableForm(isMsg);
    this.ref.detectChanges();
  }

  // method to get the toggle name
  getToggleName(): string {
    var name: string;
    this.partiesCommonService.toggle$.subscribe(n => {
      name = n.toggleName;
    })
    return name;
  }

  // method to enable or disable the form
  setEnableDisableForm(flag: boolean) {
    if (flag == true) {
      this.organizationForm.enable();
      this.isDisabled = false;
    } else if (flag == false) {
      this.organizationForm.disable();
      this.isDisabled = true;
    }
  }

  // method to build initial form
  buildForm() {
    const partyId = uuid.v4();
    this.organizationForm = this.fb.group({
      organizationCategoryTypeID: ['8ccd3945-eb3c-4e47-a289-077b9cdddf54'],
      organizationCategoryTypeName: ['Organization'],
      partyID: [partyId],
      code: null,
      name: null,
      description: null,
      permanentRecordIndicator: null,
      colorID: null,
      organizationPartyID: [partyId],
      officialName: null,
      creationDate: new Date(),
      partyStatusID: [uuid.v4()],
      startDateTime: new Date(),
      endDateTime: null,
      partyStatusPartyID: [partyId],
      statusTypeID: [this.statusTypeId],
      statusName: [this.statusTypeName],
      classifications: this.fb.array([]),

    }),

      this.formsManager.upsert('organizationsForm', this.organizationForm, {
        arrControlFactory: { classifications: this.partiesFactoryService.partiesClassificationControl }
      })
    //arrControlFactory: { personOccupations: this.personsFactoryService.personClassificationControl, associatedAreas: this.cityAreaFactoryService.associatedAreaControl }

  }

  // method to display retrieved city into form
  displayOrganization(organization) {
    this.organizationForm.patchValue({
      organizationCategoryTypeID: organization.organizationCategoryTypeID,
      organizationCategoryTypeName: organization.organizationCategoryTypeName,
      partyID: organization.partyID,
      code: organization.code,
      name: organization.name,
      description: organization.description,
      permanentRecordIndicator: organization.permanentRecordIndicator,
      colorID: organization.colorID,
      organizationPartyID: organization.organizationPartyID,
      officialName: organization.officialName,
      creationDate: organization.creationDate,
      partyStatusID: organization.partyStatusID,
      startDateTime: organization.startDateTime,
      endDateTime: organization.endDateTime,
      partyStatusPartyID: organization.partyStatusPartyID,
      statusTypeID: organization.statusTypeID,
      statusName: organization.statusName
    });

    // create controls

    this.organizationForm.setControl('classifications', this.setExistingClassifications(organization.classifications));
    this.setPartiesClassificationList();
    this.ref.detectChanges();
  }

  // metdhod to display the retrieved person occupation detail and into the list box
  setExistingClassifications(classificationSets: PartiesClassificationDTO[]): FormArray {
    const formArray = new FormArray([]);
    classificationSets.map(c => {
      formArray.push(this.fb.group({
        partyClassificationID: c.partyClassificationID,
        startDateTime: c.startDateTime,
        endDateTime: c.endDateTime,
        primaryTypeIndicator: c.primaryTypeIndicator,
        partyID: c.partyID,
        categoryTypeName: c.categoryTypeName,
        categoryTypeID: c.categoryTypeID,
      }));
    });
    return formArray;
  }

  // add new person occupation
  onAddPartiesClassifcation(classifications: any[]): void {
    var idx: number;
    // classfications if empty do nothing
    if (classifications.length < 1) {
      return;
    }
    // assign default value in area classification
    let partyClassifications = this.organizationForm.controls['classifications'] as FormArray;
    classifications.map(c => {
      // detect if classifications already exists, idx less than zero meaning not yet in the list
      idx = this.getClassifier.value.findIndex(i => i.categoryTypeID === c.categoryTypeID);
      if (idx < 0) {
        let partyClassification = this.fb.group({
          partyClassificationID: uuid.v4(),
          startDateTime: new Date(),
          endDateTime: null,
          primaryTypeIndicator: null,
          partyID: this.organizationForm.get('partyID').value,
          categoryTypeName: c.name,
          categoryTypeID: c.categoryTypeID,
        });
        // insert new record here and refresh the display of the list
        partyClassifications.push(partyClassification);
      }
    })
  }

  // method getter to return a cast as form array person occupation into control
  get getClassifier(): FormArray {
    return this.organizationForm.get('classifications') as FormArray;
  }

  // method to set the listbox display category name and id(s)
  setPartiesClassificationList() {
    var listOfData: any[] = [];

    this.classifications = this.organizationForm.get('classifications').value;
    if (this.classifications.length > 0) {
      this.classifications.map(c => {
        listOfData = [
          ...listOfData,
          { name: c.categoryTypeName, id: c.partyClassificationID }
        ]
      })
    }
    this.setValues(listOfData);

  }

  // method to assign value(s) person occupation in list box
  setValues(params) {
    this.lists = params;
  }

  // method to set person status into control
  onUpdateOrganizationStatus(status: any[]) {
    if (status.length < 1) {
      return;
    }
    status.map(s => {
      // assign values to status control
      this.organizationForm.get('statusTypeID').patchValue(s.statusTypeId);
      this.organizationForm.get('statusName').patchValue(s.name);
    })

  }

  // method to call occupation picklist using the navigation url
  onAddClassification() {
     this.router.navigateByUrl('/common-objects/party/organization/classification-picklist', { state: { source: this.sourceParty } });
  }

  // method to call area status type picklist using the navigating url
  onPickStatusType() {
     this.router.navigateByUrl('/common-objects/party/organization/status-picklist', { state: { source: this.sourceParty } });
    // this.router.navigateByUrl('/common-objects/party/person/parties/person/status-picklist', { state: { statusTypeId: this.statusTypeId } });
  }
  
  // method to unsubscribe the form state when no longer used
  ngOnDestroy() {
    this.formsManager.unsubscribe('organizationsForm');
  }

} // organizationsFormCompoent end brace
