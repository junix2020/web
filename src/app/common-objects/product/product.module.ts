import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GraphQLModule } from '@web/graphql';
import { ShellModule } from '@web/shell';
import {
  NzButtonModule,
  NzCheckboxModule,
  NzCollapseModule,
  NzFormModule,
  NzInputModule,
  NzMessageModule,
  NzModalModule,
  NzModalServiceModule,
  NzSelectModule,
  NzSwitchModule,
} from 'ng-zorro-antd';
import { GoodTypeFormComponent } from './components/good-type-form.component';
import { ServiceFormComponent } from './components/service-form.component';
import { ServiceTypeFormComponent } from './components/service-type-form.component';
import { GoodTypeListPage } from './containers/good-type-list.page';
import { GoodTypeSavePage } from './containers/good-type-save.page';
import { ServiceListPage } from './containers/service-list.page';
import { ServiceSavePage } from './containers/service-save.page';
import { ServiceTypeListPage } from './containers/service-type-list.page';
import { ServiceTypeSavePage } from './containers/service-type-save.page';
import { ProductRoutingModule } from './product-routing.module';

@NgModule({
  declarations: [
    GoodTypeFormComponent,
    GoodTypeSavePage,
    GoodTypeListPage,
    ServiceSavePage,
    ServiceListPage,
    ServiceFormComponent,
    ServiceTypeFormComponent,
    ServiceTypeSavePage,
    ServiceTypeListPage,
  ],
  imports: [
    ShellModule,
    FormsModule,
    GraphQLModule,
    ReactiveFormsModule,
    ProductRoutingModule,
    NzModalModule,
    NzModalServiceModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzCollapseModule,
    NzCheckboxModule,
    NzMessageModule,
    NzSwitchModule,
  ],
})
export class ProductModule {}
