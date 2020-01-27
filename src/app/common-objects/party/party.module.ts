import { CommonModule } from '@angular/common';
import { ShellModule } from '../../shell';
import { NzModalServiceModule, NzModalModule, NzFormModule, NzInputModule, NzButtonModule, NzSelectModule, NzCollapseModule, NzCheckboxModule, NgZorroAntdModule, NzNotificationModule } from 'ng-zorro-antd';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { NgModule } from '@angular/core';
import { PersonsListComponent } from './components/persons-list.component';
import { PersonsListPageComponent } from './containers/persons-list-page.component';
import { MessageService } from '../common-attributes/message.service';
import { HttpErrorHandler } from '../common-attributes/http-error-handler-service';
import { PartyRoutingModule } from './party-routing.module';
import { PersonsViewPageComponent } from './containers/persons-view-page.component';
import { PersonsFormComponent } from './components/persons-form.component';
import { PersonsNewPageComponent } from './containers/persons-new-page.component';
import { PersonsEditPageComponent } from './containers/persons-edit-page.component';
import { PartiesService } from './services/parties.service';
import { PartiesCommonService } from './services/parties-common.service';
import { PartiesClassificationPicklistPageComponent } from './containers/parties-classification-picklist-page.component';
import { PartiesClassificationPicklistComponent } from './components/parties-classification-picklist.component';
import { PartiesListShowHiddenComponent } from './components/parties-list-show-hidden.component';
import { OrganizationsListPageComponent } from './containers/organizations-list-page.component';
import { OrganizationsListComponent } from './components/organizations-list.component';
import { OrganizationsFormComponent } from './components/organizations-form.component';
import { OrganizationsNewPageComponent } from './containers/organizations-new-page.component';
import { PartiesStatusPickListComponent } from './components/parties-status-picklist.component';
import { PartiesStatusPickListPageComponent } from './containers/parties-status-picklist-page.component';
import { OrganizationsViewPageComponent } from './containers/organizations-view-page.component';
import { OrganizationsEditPageComponent } from './containers/organizations-edit-page.component';

@NgModule({
  declarations: [
    PersonsListComponent,
    PersonsListPageComponent,
    PersonsViewPageComponent,
    PersonsFormComponent,
    PartiesListShowHiddenComponent,
    PersonsNewPageComponent,
    PersonsEditPageComponent,
    OrganizationsListPageComponent,
    OrganizationsListComponent,
    PersonsNewPageComponent,
    OrganizationsFormComponent,
    OrganizationsNewPageComponent,
    OrganizationsViewPageComponent,
    OrganizationsEditPageComponent,
    PartiesClassificationPicklistPageComponent,
    PartiesClassificationPicklistComponent,
    PartiesStatusPickListPageComponent,
    PartiesStatusPickListComponent
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
    PartyRoutingModule
  ],
  entryComponents: [PartiesListShowHiddenComponent],
  providers: [
    PartiesCommonService,
    PartiesService,
    HttpErrorHandler,
    MessageService

  ]
})
export class PartyModule {
  constructor() { }
  
}
