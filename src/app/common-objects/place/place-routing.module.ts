import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavigationListComponent } from '@web/shell';
import { AreaClassificationPickListPageComponent } from './containers/area-classification-picklist-page.component';
import { AreaStatusTypePickListPageComponent } from './containers/area-status-type-picklist-page.component';
import { BarangayEditPage } from './containers/barangay-edit.page';
import { BarangayListPage } from './containers/barangay-list.page';
import { BarangayNewPage } from './containers/barangay-new.page';
import { CityAreaEditPageComponent } from './containers/city-area-edit-page.component';
import { CityAreaViewPageComponent } from './containers/city-area-view-page.component';
import { CityAssociatedAreaBarangayPickListPageComponent } from './containers/city-associated-area-barangay-picklist-page.component';
import { CityAssociatedAreaCityPickListPageComponent } from './containers/city-associated-area-city-picklist-page.component';
import { CityAssociateAreaProvincePickListPageComponent } from './containers/city-associated-area-province-picklist-page.component';
import { CityListPageComponent } from './containers/city-list-page.component';
import { CityNewPageComponent } from './containers/city-new-page.component';
import { CountryEditPage } from './containers/country-edit.page';
import { CountryListPage } from './containers/country-list.page';
import { CountryNewPage } from './containers/country-new.page';
import { MunicipalityEditPage } from './containers/municipality-edit.page';
import { MunicipalityListPage } from './containers/municipality-list.page';
import { MunicipalityNewPage } from './containers/municipality-new.page';
import { ProvinceEditPage } from './containers/province-edit.page';
import { ProvinceListPage } from './containers/province-list.page';
import { ProvinceNewPage } from './containers/province-new.page';
import { AreaResolver } from './state/area.resolver';

const routes: Routes = [
  {
    path: 'area/political-area/city',
    component: CityListPageComponent
  },

  {
    path: 'area/political-area/city/new',
    component: CityNewPageComponent
  },
  //{
  //  path: 'area/political-area/city/city-associated-area-picklist',
  //  component: AreaAssociatedPickListComponent
  //},
  {
    path: 'area/political-area/city/city-associated-area-province-picklist',
    component: CityAssociateAreaProvincePickListPageComponent
  },
  {
    path: 'area/political-area/city/areaclassification-picklist',
    component: AreaClassificationPickListPageComponent
  },
  {
    path: 'area/political-area/city/area-status-type-picklist',
    component: AreaStatusTypePickListPageComponent
  },
  {
    path: 'area/political-area/city/city-associated-area-barangay-picklist',
    component: CityAssociatedAreaBarangayPickListPageComponent
  },
  {
    path: 'area/political-area/city/city-associated-area-city-picklist',
    component: CityAssociatedAreaCityPickListPageComponent
  },
  {
    path: 'area/political-area/city/edit/:areaID',
    component: CityAreaEditPageComponent
  },
  {
    path: 'area/political-area/city/view/:areaID',
    component: CityAreaViewPageComponent
  },
  {
    path: 'area/political-area/province',
    component: ProvinceListPage
  },
  {
    path: 'area/political-area/province/new',
    component: ProvinceNewPage
  },
  {
    path: 'area/political-area/province/:areaID',
    component: ProvinceEditPage,
    resolve: { area: AreaResolver }
  },
  {
    path: 'area/political-area/country',
    component: CountryListPage
  },
  {
    path: 'area/political-area/country/new',
    component: CountryNewPage
  },
  {
    path: 'area/political-area/country/:areaID',
    component: CountryEditPage,
    resolve: { area: AreaResolver }
  },
  {
    path: 'area/political-area/barangay',
    component: BarangayListPage
  },
  {
    path: 'area/political-area/barangay/new',
    component: BarangayNewPage
  },
  {
    path: 'area/political-area/barangay/:areaID',
    component: BarangayEditPage,
    resolve: { area: AreaResolver }
  },
  {
    path: 'area/political-area/municipality',
    component: MunicipalityListPage
  },
  {
    path: 'area/political-area/municipality/new',
    component: MunicipalityNewPage
  },
  {
    path: 'area/political-area/municipality/:areaID',
    component: MunicipalityEditPage,
    resolve: { area: AreaResolver }
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
export class PlaceRoutingModule {}
