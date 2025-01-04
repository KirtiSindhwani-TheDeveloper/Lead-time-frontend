import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { PrimengModule } from './primeng/primeng.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedRoutingModule,
    PrimengModule
  ],
  exports:[
    PrimengModule
  ]
})
export class SharedModule { }
