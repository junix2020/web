import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusTypePipe } from './pipes/status-type.pipe';



@NgModule({
  declarations: [StatusTypePipe],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
