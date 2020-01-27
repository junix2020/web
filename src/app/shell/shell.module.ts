import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import {
  NzButtonModule,
  NzCheckboxModule,
  NzCollapseModule,
  NzEmptyModule,
  NzFormModule,
  NzGridModule,
  NzIconModule,
  NzInputModule,
  NzModalModule,
  NzModalServiceModule,
  NzTreeModule,
} from 'ng-zorro-antd';
import { BarComponent } from './components/bar.component';
import { ColumnListModalComponent } from './components/column-list-modal.component';
import { EmptyListComponent } from './components/empty-list.component';
import { GeneralFormComponent } from './components/general-form.component';
import { SplitComponent } from './components/split.component';
import { SplitterComponent } from './components/splitter.component';
import { ToolbarComponent } from './components/toolbar.component';
import { JListBoxComponent } from './containers/jlist-box.component';
import { LayoutComponent } from './containers/layout.component';
import { ListBoxComponent } from './containers/list-box.component';
import { NavigationListComponent } from './containers/navigation-list.component';
import { PickListComponent } from './containers/pick-list.component';
import { TreeComponent } from './containers/tree.component';
import { SplitBehaviorDirective } from './directives/split-behavior.directive';

export * from './components/column-list-modal.component';
export * from './components/empty-list.component';
export * from './components/split.component';
export * from './components/splitter.component';
export * from './containers/navigation-list.component';
export * from './containers/pick-list.component';
export * from './directives/split-behavior.directive';
export * from './services/panel.service';
export * from './services/splitter.service';
export * from './services/toolbar.service';
export * from './services/tree.service';

@NgModule({
  declarations: [
    LayoutComponent,
    ToolbarComponent,
    BarComponent,
    SplitterComponent,
    SplitComponent,
    SplitBehaviorDirective,
    TreeComponent,
    NavigationListComponent,
    ColumnListModalComponent,
    EmptyListComponent,
    PickListComponent,
    ListBoxComponent,
    JListBoxComponent,
    GeneralFormComponent,
  ],
  entryComponents: [
    SplitterComponent,
    ColumnListModalComponent,
    EmptyListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    RouterModule,
    NzButtonModule,
    NzIconModule,
    NzTreeModule,
    NzCollapseModule,
    NzEmptyModule,
    NzModalModule,
    NzModalServiceModule,
    NzGridModule,
    NzCheckboxModule,
    NzInputModule,
    NzFormModule,
    AgGridModule.withComponents([EmptyListComponent]),
  ],
  exports: [
    CommonModule,
    EmptyListComponent,
    NavigationListComponent,
    PickListComponent,
    ListBoxComponent,
    JListBoxComponent,
    ColumnListModalComponent,
    GeneralFormComponent,
    SplitterComponent,
    SplitComponent,
    SplitBehaviorDirective,
    AgGridModule,
  ],
})
export class ShellModule {}
