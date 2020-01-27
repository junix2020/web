import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShellModule } from '@web/shell';
import {
  NzButtonModule,
  NzCheckboxModule,
  NzCollapseModule,
  NzDropDownModule,
  NzFormModule,
  NzGridModule,
  NzIconModule,
  NzInputModule,
  NzMessageModule,
  NzModalModule,
  NzModalServiceModule,
  NzNotificationModule,
  NzSelectModule,
  NzSwitchModule
} from 'ng-zorro-antd';
import { HttpErrorHandler } from '../common-attributes/http-error-handler-service';
import { MessageService } from '../common-attributes/message.service';
//import { AreaClassificationListBoxComponent } from './components/area-classification-list-box.component';
import { AreaClassificationPickListComponent } from './components/area-classification-picklist.component';
import { AreaShowHiddenComponent } from './components/area-show-hidden.component';
import { AreaStatusTypeListComponent } from './components/area-status-type-picklist.component';
import { AssociatedAreaListFormComponent } from './components/associated-area-list-form.component';
import { BarangayFormComponent } from './components/barangay-form.component';
import { CityAssociatedAreaBarangayPickListComponent } from './components/city-associated-area-barangay-picklist.component';
import { CityAssociatedAreaCityPickListComponent } from './components/city-associated-area-city-picklist.component';
import { CityAssociatedAreaListFormComponent } from './components/city-associated-area-list-form.component';
import { CityAssociatedAreaProvincePickListComponent } from './components/city-associated-area-province-picklist.component';
import { CityFormComponent } from './components/city-form.component';
import { CityListComponent } from './components/city-list.component';
import { CountryFormComponent } from './components/country-form.component';
import { MunicipalityFormComponent } from './components/municipality-form.component';
import { ProvinceFormComponent } from './components/province-form.component';
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
import { CityEditPage } from './containers/city-edit.page';
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
import { PlaceRoutingModule } from './place-routing.module';
import { CityAreasService } from './services/city-areas.service';
//import { CityAssociatedAreaService } from './services/city-associated-area-service';
import { AreaClassificationListBoxComponent } from './components/area-classification-list-box.component';

@NgModule({
  declarations: [
    AssociatedAreaListFormComponent,
    ProvinceNewPage,
    ProvinceEditPage,
    ProvinceListPage,
    ProvinceFormComponent,
    CountryFormComponent,
    CountryNewPage,
    CountryListPage,
    CountryEditPage,
    MunicipalityListPage,
    MunicipalityNewPage,
    MunicipalityEditPage,
    BarangayEditPage,
    BarangayNewPage,
    BarangayListPage,
    BarangayFormComponent,
    MunicipalityFormComponent,
    AreaClassificationListBoxComponent,
    // City Start
    AreaShowHiddenComponent,
    AreaClassificationPickListPageComponent,
    AreaClassificationPickListComponent,
    AreaStatusTypePickListPageComponent,
    AreaStatusTypeListComponent,
    CityListComponent,
    CityListPageComponent,
    CityEditPage,
    CityFormComponent,
    CityNewPageComponent,
    CityAssociatedAreaListFormComponent,
    CityAssociateAreaProvincePickListPageComponent,
    CityAssociatedAreaProvincePickListComponent,
    CityAssociatedAreaBarangayPickListPageComponent,
    CityAssociatedAreaBarangayPickListComponent,
    CityAssociatedAreaCityPickListPageComponent,
    CityAssociatedAreaCityPickListComponent,
    CityAreaEditPageComponent,
    CityAreaViewPageComponent
  ],
  imports: [
    ShellModule,
    PlaceRoutingModule,
    FormsModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    NzIconModule,
    NzGridModule,
    NzModalModule,
    NzModalServiceModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzCollapseModule,
    NzCheckboxModule,
    NzSwitchModule,
    NzMessageModule,
    NzDropDownModule,
    NzNotificationModule
  ],
  entryComponents: [AreaShowHiddenComponent],
  providers: [
    //CityAssociatedAreaService,
    CityAreasService,
    HttpErrorHandler,
    MessageService
  ]
})
export class PlaceModule {}
