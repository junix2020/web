import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './shell/containers/layout.component';
import { NavigationListComponent } from './shell/containers/navigation-list.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'common-objects/core-object',
        loadChildren: () =>
          import('./common-objects/core-object/core-object.module').then(
            m => m.CoreObjectModule
          )
      },
      {
        path: 'common-objects/place',
        loadChildren: () =>
          import('./common-objects/place/place.module').then(m => m.PlaceModule)
      },
      {
        path: 'common-objects/party',
        loadChildren: () =>
          import('./common-objects/party/party.module').then(m => m.PartyModule)
      },
      {
        path: 'transport-service',
        loadChildren: () =>
          import('./transport-service/transport-service.module').then(
            m => m.TransportServiceModule
          )
      },
      {
        path: 'common-objects/product',
        loadChildren: () =>
          import('./common-objects/product/product.module').then(
            m => m.ProductModule
          )
      },
      {
        path: '**',
        component: NavigationListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
