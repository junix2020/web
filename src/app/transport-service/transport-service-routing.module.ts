import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BookingBatchListPageComponent } from './booking/containers/booking-batch-list-page.component';
import { NavigationListComponent } from '../shell';
import { BookingBatchNewPageComponent } from './booking/containers/booking-batch-new-page.component';
import { BookingBatchCustomerPartyPickListPageComponent } from './booking/containers/booking-batch-customer-party-picklist-page.component';
import { BookingBatchEditPageComponent } from './booking/containers/booking-batch-edit-page.component';
import { BookingBatchViewPageComponent } from './booking/containers/booking-batch-view-page.component';


const routes: Routes = [
    {
        path: 'booking/booking-batch',
        component: BookingBatchListPageComponent
    },
    {
        path: 'booking/booking-batch/new',
        component: BookingBatchNewPageComponent
    },
    {         
        path: 'booking/booking-batch/edit/:bookingBatchID',
        component: BookingBatchEditPageComponent
    },
    {
        path: 'booking/booking-batch/view/:bookingBatchID',
        component: BookingBatchViewPageComponent
    },
    {
        path: 'booking/booking-batch/booking-batch-customer-party-picklist',
        component: BookingBatchCustomerPartyPickListPageComponent
    },
    {
        path: '**',
        component: NavigationListComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TransportServiceRoutingModule { }
