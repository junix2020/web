import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavigationListComponent } from '@web/shell';
import { AssociationTypeListPage } from './containers/association-type-list.page';
import { AssociationTypeSavePage } from './containers/association-type-save.page';
import { CategoryTypeListPage } from './containers/category-type-list.page';
import { CategoryTypeSavePage } from './containers/category-type-save.page';
import { RoleTypeListPage } from './containers/role-type-list.page';
import { RoleTypeSavePage } from './containers/role-type-save.page';
import { StatusTypeListPage } from './containers/status-type-list.page';
import { StatusTypeSavePage } from './containers/status-type-save.page';
import { AssociationTypeResolver } from './resolvers/association-type.resolver';
import { CategoryTypeResolver } from './resolvers/category-type.resolver';
import { RoleTypeResolver } from './resolvers/role-type.resolver';
import { StatusTypeResolver } from './resolvers/status-type.resolver';

const routes: Routes = [
  {
    path: 'category-type',
    component: CategoryTypeListPage,
  },
  {
    path: 'category-type/new',
    component: CategoryTypeSavePage,
  },
  {
    path: 'category-type/:categoryTypeID',
    component: CategoryTypeSavePage,
    resolve: {
      categoryType: CategoryTypeResolver,
    },
  },
  {
    path: 'association-type',
    component: AssociationTypeListPage,
  },
  {
    path: 'association-type/new',
    component: AssociationTypeSavePage,
  },
  {
    path: 'association-type/:associationTypeID',
    component: AssociationTypeSavePage,
    resolve: {
      associationType: AssociationTypeResolver,
    },
  },
  {
    path: 'role-type',
    component: RoleTypeListPage,
  },
  {
    path: 'role-type/new',
    component: RoleTypeSavePage,
  },
  {
    path: 'role-type/:roleTypeID',
    component: RoleTypeSavePage,
    resolve: {
      roleType: RoleTypeResolver,
    },
  },
  {
    path: 'status-type',
    component: StatusTypeListPage,
  },
  {
    path: 'status-type/new',
    component: StatusTypeSavePage,
  },
  {
    path: 'status-type/:statusTypeID',
    component: StatusTypeSavePage,
    resolve: {
      statusType: StatusTypeResolver,
    },
  },
  {
    path: '**',
    component: NavigationListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreObjectRoutingModule {}
