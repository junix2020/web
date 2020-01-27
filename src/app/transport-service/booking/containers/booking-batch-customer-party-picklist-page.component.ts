import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CityAssociatedAreasBarangayQuery } from '../../../common-objects/place/state/city-associated-area-barangay-picklist.query';
import { BookingBatchCustomerPartyPicklistService } from '../services/booking-batch-customer-party-picklist.service';
import { BookingBatchCustomerPartyPicklistQuery } from '../state/booking-batch-customer-party-picklist.query';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingBatchCustomerPartyPicklistDTO } from '../dto/booking-batch-customer-party-picklist.dto';
import { takeUntil } from 'rxjs/operators';
import { ToolbarItemType, Toolbar, ToolbarType, pickListFormToolbars } from '../../../shell';
import { BookingBatchCustomerPartyPicklistComponent } from '../components/booking-batch-customer-party-picklist.component';


@Component({
    selector: 'booking-batch-customer-party-picklist-page',
    template: `
 
 <nz-collapse>
   <nz-collapse-panel
        nzHeader="Customer"
        [nzDisabled]="false"
        [nzActive]="true"
        [nzShowArrow]="false">
      <ng-container *ngIf="(bookingBatchCustomerParties$ | async) as bookingBatchCustomerParties"> 
          <section [class.hide]="isLoading$ | async">
              <booking-batch-customer-party-picklist
                 [customerParties]="bookingBatchCustomerParties">
              </booking-batch-customer-party-picklist>
          </section>
      </ng-container>
   </nz-collapse-panel>
</nz-collapse>
  `
})
export class BookingBatchCustomerPartyPickListPageComponent implements OnInit, OnDestroy, AfterViewInit {

    bookingBatchCustomerParties$: Observable<BookingBatchCustomerPartyPicklistDTO[]>;
    isLoading$: Observable<boolean>;
    destroy$ = new Subject();

    @ViewChild(BookingBatchCustomerPartyPicklistComponent, { static: false }) bookingBatchCustomerPartyPicklistComponent: BookingBatchCustomerPartyPicklistComponent;

    constructor(
        private bookingBatchCustomerPartyPicklistService: BookingBatchCustomerPartyPicklistService,
        private bookingBatchCustomerPartyPicklistQuery: BookingBatchCustomerPartyPicklistQuery,
        private route: ActivatedRoute,
        private router: Router,
        private toolbar: Toolbar,
        private ref: ChangeDetectorRef

    ) { }

    getBookingBatchCustomerParties() {
         this.bookingBatchCustomerParties$ = this.bookingBatchCustomerPartyPicklistService.getBookingBatchCustomerParties();
         this.isLoading$ = this.bookingBatchCustomerPartyPicklistQuery.selectLoading();
    }

    ngOnInit() {

        // subscribe toolbar item
        this.toolbar.clicked$
            .pipe(takeUntil(this.destroy$))
            .subscribe(type => this.onToolbarItemClicked(type));
        this.toolbar.load(...pickListFormToolbars());
        
        if (this.bookingBatchCustomerPartyPicklistQuery.getAll().length > 0) {
            this.bookingBatchCustomerParties$ = this.bookingBatchCustomerPartyPicklistQuery.selectAll();
        } else {
            this.getBookingBatchCustomerParties();
        }
    }

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

    onSelect() {
        this.bookingBatchCustomerPartyPicklistComponent.onSelect();
    }

    onCancel() {
        this.bookingBatchCustomerPartyPicklistComponent.onCancel();
    }

    ngAfterViewInit() {

    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();

    }

    onItemDoubleClick(item: any) {
        //this.router.navigate(['edit'], { relativeTo: this.route });
        //this.toolbar.disable(ToolbarType.VIEW);
    }

    onItemSelect(item: any) {
    }
}

