import { Component, OnInit, AfterViewInit, OnDestroy, Output, EventEmitter, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { BookingBatchFormState } from '../state/booking-batch-form-state';
import { AkitaNgFormsManager } from '@datorama/akita-ng-forms-manager';
import { BookingBatchService } from '../services/booking-batch.service';
import { filter, map } from 'rxjs/operators';
import * as uuid from "uuid";
import { BookingBatchDTO } from '../dto/booking-batch.dto';


@Component({
    selector: 'app-booking-batch-form',
    template: `
 <!-- <pre>{{ state$ | async | json }} </pre> -->

<form nz-form  [nzNoColon]="true" [formGroup]="bookingBatchForm" novalidate >
          <input nz-input formControlName="bookingBatchID" id="bookingBatchID" type="hidden"/> 
         <nz-form-item>
            <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="batchCode">Batch Code</nz-form-label>
            <nz-form-control [nzSm]="16" [nzXs]="24">
               <input nz-input formControlName="batchCode" nz-input id="batchCode"/>
            </nz-form-control>
         </nz-form-item>

         <nz-form-item>
            <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="name">Display Name</nz-form-label>
            <nz-form-control [nzSm]="16" [nzXs]="24">
               <input nz-input formControlName="name" id="name" />
            </nz-form-control>
         </nz-form-item>

         <nz-form-item>
            <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="description">Description</nz-form-label>
            <nz-form-control [nzSm]="16" [nzXs]="24">
               <textarea nz-input rows="3" formControlName="description" id="description"></textarea>
            </nz-form-control>
         </nz-form-item>

            <nz-form-item>
                  <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="creationDate">Creation Date</nz-form-label>
                  <nz-form-control [nzSm]="16" [nzXs]="24">
                    <nz-date-picker input="date" [nzFormat] formControlName="creationDate" id="creationDate"></nz-date-picker>
                  </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="bookingSlipQuantity">Booking Slip Quantity</nz-form-label>
            <nz-form-control [nzSm]="16" [nzXs]="24">
               <input type="number" nz-input formControlName="bookingSlipQuantity" id="bookingSlipQuantity" />
            </nz-form-control>
         </nz-form-item>
    
         <input nz-input formControlName="customerPartyID" id="customerPartyID" type="hidden"/>
         <nz-form-item>
               <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="customer">Customer</nz-form-label>
                   <nz-form-control [nzSm]="16" [nzXs]="24">
                        <div nz-row [nzGutter]="10">
                                 <div nz-col [nzSpan]="22">
                                       <input nz-input readonly formControlName="customer" id="customer"/>
                                 </div>
                                 <div nz-col [nzSpan]="1">
                                       <button [disabled]="isDisabled" nz-button (click)="onPickCustomerParty()">
                                             <i nz-icon  nzType="ellipsis" nzTheme="outline"></i>
                                       </button>
                                 </div>
                                                                  
                        </div>
                   </nz-form-control>
         </nz-form-item>

         <input nz-input formControlName="bookingPartyID" id="bookingPartyID" type="hidden"/>
         <nz-form-item>
            <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="creatingUser">Creating User</nz-form-label>
            <nz-form-control [nzSm]="16" [nzXs]="24">
               <input readonly nz-input formControlName="bookingParty" id="bookingParty" />
            </nz-form-control>
         </nz-form-item>

         <input nz-input formControlName="statusTypeID" id="statusTypeID" type="hidden"/>
         <nz-form-item>
               <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="status">Status</nz-form-label>
                   <nz-form-control [nzSm]="16" [nzXs]="24">
                        <div nz-row [nzGutter]="10">
                                 <div nz-col [nzSpan]="22">
                                       <input nz-input readonly formControlName="status" id="status"/>
                                 </div>
                                 <div nz-col [nzSpan]="1">
                                       <button [disabled]="isDisabled" nz-button (click)="onPickStatusType()">
                                             <i nz-icon  nzType="ellipsis" nzTheme="outline"></i>
                                       </button>
                                 </div>
                                                                  
                        </div>
                   </nz-form-control>
         </nz-form-item>

         
         

</form>
<!-- <pre>{{bookingBatchForm.value | json}}</pre> -->
`,
    styles: [
        `
        //  nz-date-picker  {
        //margin: 0 8px 12px 0;
      }
        `
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookingBatchFormComponent implements OnInit, AfterViewInit, OnDestroy {
    @Output() onSave = new EventEmitter<BookingBatchDTO>();
    @Output() resetForm = new EventEmitter();  
    @Output() enableDelete = new EventEmitter();  // use in View or Edit to set enable delete toolbar button
    @Output() disableDelete = new EventEmitter(); // use in View or Edit to set disable delete toolbar button
    @Output() enableSave = new EventEmitter();    // use in View to enable toolbar save button
    @Output() disableSave = new EventEmitter();   // use in View to disable toolbar save button
    

    @Input() bookingBatchId;
    @Input() status: any;
    @Input() areaId: string;
    @Input() isDisabled: boolean;
    @Input() isMsg: boolean;

    bookingBatchForm: FormGroup;
    forms: any;
    bookingBatchData: BookingBatchDTO;

    sourceData: any;
    values: any[] = [];

    state$: Observable<object>;
    isColName: boolean = false;
  
    // default status new status
    statusTypeId = "0615d7a0-6d66-4171-bb6f-f37c177e0df4" // default of New status
    statusTypeName = "New" // default status type name

   
    constructor(
        public router: Router, public activatedRoute: ActivatedRoute,
        private formsManager: AkitaNgFormsManager<BookingBatchFormState>,
        private fb: FormBuilder,
        private bookingBatchService: BookingBatchService,
        private ref: ChangeDetectorRef

    ) { }


    //setMessage(msg: string) {
    //    this.message = msg;
    //}

    // set result params data from parent and status example: Edit, View, New
    setResults(params) {
        this.bookingBatchData = params; // assign param data parameter
        this.displayRetrievedData(this.bookingBatchData, this.isMsg);  //  call method to display data retrieved from server
        this.setDeleteToolbar();  // cal method to set toolbar delete
        this.ref.detectChanges();
    }
           
    // remove form manager to clear null data
    onEmptyForm() {
        this.formsManager.remove('newForm');
    }

    // save and submit booking batch data
    saveBookingBatch() {
        this.onSave.emit(this.formsManager.getForm('newForm').value);
    }

    // reset all to default state
    formReset() {
        this.formsManager.unsubscribe('newForm');
        this.resetBookingBatchForm();
        this.buildForm('newForm');
    }

    // event to reset a form
    resetBookingBatchForm() {
        this.resetForm.emit();
    }

    // reset the form and add new entry form
    bookingBatchFormReset() {
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

        // create a fresh form
        this.buildForm('newForm');
     }

    ngAfterViewInit(): void {
        if (this.status == 'View') {
            this.disableSave.emit(); // set save toolbar to disable by defalt
        } else if (this.status == 'Edit') {
         
          //  this.displayRetrievedData(this.bookingBatchData, this.isMsg);      // display data based on msg(true/false)
        } else if (this.status == 'New') {    // use newForm if message from component was new
            this.buildForm('newForm');
        }
        // picklist source
        this.picklistSource();                 // call method to detect what source  was sent from state object
    }

    // disable delete toolbar button if status was active else enable if status was draft
    setDeleteToolbar() {
        var status = this.bookingBatchForm.get('status').value;

        if (status.toLowerCase() == 'active') {
            this.disableDelete.emit();
        } else if (status.toLowerCase() == 'draft' || status.toLowerCase() == 'new') {
            this.enableDelete.emit();
        }
    }

    // display data retrieved from database using edit or view page
    displayRetrievedData(bookingBatchDto: BookingBatchDTO, isMsg: boolean) {
        // check whether msg true/false to activate form
        this.setEnableDisableForm(isMsg);
        // display booking batch to into form
        this.displayBookingBatch(bookingBatchDto);

        //  call method to detect where the source coming
        this.ref.detectChanges();
    }

    setEnableDisableForm(flag: boolean) {
        if (flag == true) {
            this.formEnable(true)
            this.isDisabled = false;
        } else if (flag == false) {
            this.formEnable(false)
            this.isDisabled = true;
        }
    }

     // display retrieved booking batch to form
    displayBookingBatch(bookingBatchDto) {
        bookingBatchDto.map(bookingBatch => {
            this.bookingBatchForm.patchValue({
                bookingBatchID: bookingBatch.bookingBatchID,
                batchCode: bookingBatch.batchCode,
                name: bookingBatch.name,
                description: bookingBatch.description,
                creationDate: bookingBatch.creationDate,
                bookingSlipQuantity: bookingBatch.bookingSlipQuantity,
                customerPartyID: bookingBatch.customerPartyID,
                customer: bookingBatch.customer,
                bookingPartyID: bookingBatch.bookingPartyID,
                bookingParty: bookingBatch.bookingParty,
                statusTypeID: bookingBatch.statusTypeID,
                status: bookingBatch.status
            });
        })
        
    }

    // build initial form
    buildForm(form: any) {

        this.bookingBatchForm = this.fb.group({
            bookingBatchID: [uuid.v4()],
            batchCode: null,
            name: null,
            description: null,
            creationDate: null,
            bookingSlipQuantity: null,
            customerPartyID: null,
            customer: null,
            bookingPartyID: null,
            bookingParty: null,
            statusTypeID: [this.statusTypeId],
            status: [this.statusTypeName],

        }),

            this.formsManager.upsert('newForm', this.bookingBatchForm);
    }

    // picklist source
    picklistSource() {
        switch (this.sourceData.source) {
            case 'StatusTypePickList':
                this.onSetBookingBatchStatusType();
                break;
            case 'CustomerPartyPickList':
                this.onSetBookingBatchCustomerParty();
                break;
            //case 'CityAssociatedAreaProvincePickList':
            //    this.onSetCityAssociatedAreaProvince();
            //    this.onAddAssociatedArea();
            //    break;

            default:
                  break;
        }
    }
    
    // toggle form to enable/disable
    formEnable(enable: boolean) {
        if (enable) {
            this.bookingBatchForm.enable();
            this.isDisabled = false;
        } else {
            this.bookingBatchForm.disable();
            this.isDisabled = true;
        }

    }

    // set booking batch customer party
    onSetBookingBatchCustomerParty() {
        if (this.sourceData.customerPartyID == undefined) {
            return;
        }
        this.bookingBatchForm.get('customerPartyID').patchValue(this.sourceData.bookingBatchID);
        this.bookingBatchForm.get('customer').patchValue(this.sourceData.customerName);
    }

    // set booking batch status type 
    onSetBookingBatchStatusType() {
        // do
        if (this.sourceData.statusTypeID == undefined) {
            return;
        }
        this.bookingBatchForm.get('statusTypeID').patchValue(this.sourceData.bookingBatchStatusTypeID);
        this.bookingBatchForm.get('status').patchValue(this.sourceData.bookingBatchStatusName);
    }

    onPickCustomerParty() {
        this.router.navigateByUrl('/transport-service/booking/booking-batch/booking-batch-customer-party-picklist');
    }

    onPickStatusType() {

    }

    //// method to call booking batch status type picklist
    //onBookingBatchStatusTypePickList() {

    //    if (this.bookingBatchForm.get('statusTypeID').value != null) {
    //        this.statusTypeId = this.cityForm.get('statusTypeID').value;

    //    }

    //    if (this.message == 'Edit' || this.message == 'ViewEdit') {
    //        this.router.navigateByUrl('/common-objects/place/area/political-area/city/area-status-type-picklist', { state: { statusTypeId: this.statusTypeId, message: this.message, areaId: this.areaId, enable: true } });
    //    } else {
    //        this.router.navigateByUrl('/common-objects/place/area/political-area/city/area-status-type-picklist', { state: { statusTypeId: this.statusTypeId } });
    //    }

    //}

    //// method to call province picklist
    //onProvince() {
    //    var associationType: string = 'Subsidiary Association Type';
    //    var associationTypeID: string = '2160dcca-eb32-4ea6-a161-f5b9f7d83f42';

    //    if (this.message == 'Edit' || this.message == 'ViewEdit') {
    //        this.router.navigateByUrl('/common-objects/place/area/political-area/city/city-associated-area-province-picklist', { state: { associationType: associationType, associationTypeID: associationTypeID, message: this.message, areaId: this.areaId, enable: true } });   // you can call component without state object.
    //    } else {
    //        this.router.navigateByUrl('/common-objects/place/area/political-area/city/city-associated-area-province-picklist', { state: { associationType: associationType, associationTypeID: associationTypeID } });   // you can call component without state object.
    //    }

    //    //this.router.navigateByUrl('/common-objects/place/political-area/city/province', { state: { hello: 'from city' } });            // you can call the component with state object.

    //}

    ngOnDestroy() {
        //this.formsManager.unsubscribe(this.stateName);

    }


} // CityFormCompoent end brace pair
