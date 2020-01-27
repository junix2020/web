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
import { AssociationTypeFormComponent } from './components/association-type-form.component';
import { CategoryTypeFormComponent } from './components/category-type-form.component';
import { RoleTypeFormComponent } from './components/role-type-form.component';
import { StatusTypeFormComponent } from './components/status-type-form.component';
import { AssociationTypeListPage } from './containers/association-type-list.page';
import { AssociationTypeSavePage } from './containers/association-type-save.page';
import { CategoryTypeListPage } from './containers/category-type-list.page';
import { CategoryTypeSavePage } from './containers/category-type-save.page';
import { RoleTypeListPage } from './containers/role-type-list.page';
import { RoleTypeSavePage } from './containers/role-type-save.page';
import { StatusTypeListPage } from './containers/status-type-list.page';
import { StatusTypeSavePage } from './containers/status-type-save.page';
import { CoreObjectRoutingModule } from './core-object-routing.module';

@NgModule({
  declarations: [
    AssociationTypeFormComponent,
    CategoryTypeFormComponent,
    RoleTypeFormComponent,
    StatusTypeFormComponent,
    AssociationTypeListPage,
    AssociationTypeSavePage,
    CategoryTypeListPage,
    CategoryTypeSavePage,
    RoleTypeListPage,
    RoleTypeSavePage,
    StatusTypeListPage,
    StatusTypeSavePage,
  ],
  imports: [
    ShellModule,
    FormsModule,
    GraphQLModule,
    ReactiveFormsModule,
    CoreObjectRoutingModule,
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
export class CoreObjectModule {}
