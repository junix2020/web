import { Routes, RouterModule } from '@angular/router';
import { PersonsListPageComponent } from './containers/persons-list-page.component';
import { NavigationListComponent } from '../../shell';
import { NgModule } from '@angular/core';
import { PersonsViewPageComponent } from './containers/persons-view-page.component';
import { PersonsNewPageComponent } from './containers/persons-new-page.component';
import { PersonsEditPageComponent } from './containers/persons-edit-page.component';
import { PartiesClassificationPicklistPageComponent } from './containers/parties-classification-picklist-page.component';
import { OrganizationsListPageComponent } from './containers/organizations-list-page.component';
import { OrganizationsNewPageComponent } from './containers/organizations-new-page.component';
import { PartiesStatusPickListPageComponent } from './containers/parties-status-picklist-page.component';
import { OrganizationsViewPageComponent } from './containers/organizations-view-page.component';
import { OrganizationsEditPageComponent } from './containers/organizations-edit-page.component';

const routes: Routes = [
  {
    path: 'person',
    component: PersonsListPageComponent
  },
  {
    path: 'person/new',
    component: PersonsNewPageComponent 
  },
  {
    path: 'person/edit/:partyID',
    component: PersonsEditPageComponent
  },
  {
    path: 'person/view/:partyID',
    component: PersonsViewPageComponent
  },
  {
    path: 'person/classification-picklist',
    component: PartiesClassificationPicklistPageComponent
  },
  {
    path: 'person/status-picklist',
    component: PartiesStatusPickListPageComponent
  },
  {
    path: 'organization',
    component: OrganizationsListPageComponent
  },
  {
    path: 'organization/new',
    component: OrganizationsNewPageComponent
  },
  {
    path: 'organization/view/:partyID',
    component: OrganizationsViewPageComponent
  },
  {
    path: 'organization/edit/:partyID',
    component: OrganizationsEditPageComponent
  },
  {
    path: 'organization/classification-picklist',
    component: PartiesClassificationPicklistPageComponent
  },
  {
    path: 'organization/status-picklist',
    component: PartiesStatusPickListPageComponent
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
export class PartyRoutingModule {
  constuctor() { }
}
