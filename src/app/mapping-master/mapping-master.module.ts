import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MappingMasterRoutingModule } from './mapping-master-routing.module';
import { PrimengModule } from '../shared/primeng/primeng.module';
import { CreateMappingComponent } from './create-mapping/create-mapping.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MappingMasterRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    PrimengModule
  ],
  
  

})
export class MappingMasterModule { }
