import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzModalModule, NzModalServiceModule, NzFormModule, NzButtonModule, NzInputModule, NzSelectModule, NzCollapseModule, NzCheckboxModule, NgZorroAntdModule, NzNotificationModule } from 'ng-zorro-antd';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { TransportServiceRoutingModule } from './transport-service-routing.module';
import { ShellModule } from '../shell';
import { BookingBatchCommonService } from './booking/services/booking-batch-common-service';
import { HttpErrorHandler } from '../common-objects/common-attributes/http-error-handler-service';
import { MessageService } from '../common-objects/common-attributes/message.service';
import { BookingBatchListComponent } from './booking/components/booking-batch-list.component';
import { BookingBatchListPageComponent } from './booking/containers/booking-batch-list-page.component';
import { BookingBatchShowHiddenComponent } from './booking/components/booking-batch-show-hide.component';
import { BookingBatchService } from './booking/services/booking-batch.service';
import { BookingBatchNewPageComponent } from './booking/containers/booking-batch-new-page.component';
import { BookingBatchCustomerPartyPicklistComponent } from './booking/components/booking-batch-customer-party-picklist.component';
import { BookingBatchCustomerPartyPickListPageComponent } from './booking/containers/booking-batch-customer-party-picklist-page.component';
import { BookingBatchFormComponent } from './booking/components/booking-batch-form.component';
import { BookingBatchEditPageComponent } from './booking/containers/booking-batch-edit-page.component';
import { BookingBatchViewPageComponent } from './booking/containers/booking-batch-view-page.component';


@NgModule({
    declarations: [
        BookingBatchListComponent,
        BookingBatchListPageComponent,
        BookingBatchShowHiddenComponent,
        BookingBatchNewPageComponent,
        BookingBatchFormComponent,
        BookingBatchCustomerPartyPickListPageComponent,
        BookingBatchCustomerPartyPicklistComponent,
        BookingBatchEditPageComponent,
        BookingBatchViewPageComponent 
    ],
    imports: [
        CommonModule,
        ShellModule,
        NzModalModule,
        NzModalServiceModule,
        NzFormModule,
        NzInputModule,
        NzButtonModule,
        NzSelectModule,
        NzCollapseModule,
        NzCheckboxModule,
        ReactiveFormsModule,
        FormsModule,
        NgZorroAntdModule,
        NzNotificationModule,
        AgGridModule.withComponents([]),
        TransportServiceRoutingModule
    ],
    entryComponents: [BookingBatchShowHiddenComponent],
    providers: [
        BookingBatchCommonService,
        BookingBatchService,
        HttpErrorHandler,
        MessageService

    ]
})
export class TransportServiceModule { }
