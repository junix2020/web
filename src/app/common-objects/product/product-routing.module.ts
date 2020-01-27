import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavigationListComponent } from '@web/shell';
import { GoodTypeListPage } from './containers/good-type-list.page';
import { GoodTypeSavePage } from './containers/good-type-save.page';
import { ServiceTypeListPage } from './containers/service-type-list.page';
import { ServiceTypeSavePage } from './containers/service-type-save.page';
import { GoodTypeResolver } from './resolvers/good-type.resolver';
import { ServiceTypeResolver } from './resolvers/service-type.resolver';

const routes: Routes = [
  {
    path: 'good-type',
    component: GoodTypeListPage,
  },
  {
    path: 'good-type/new',
    component: GoodTypeSavePage,
  },
  {
    path: 'good-type/:categoryTypeID',
    component: GoodTypeSavePage,
    resolve: {
      goodType: GoodTypeResolver,
    },
  },
  {
    path: 'service-type',
    component: ServiceTypeListPage,
  },
  {
    path: 'service-type/new',
    component: ServiceTypeSavePage,
  },
  {
    path: 'service-type/:categoryTypeID',
    component: ServiceTypeSavePage,
    resolve: {
      serviceType: ServiceTypeResolver,
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
export class ProductRoutingModule {}
