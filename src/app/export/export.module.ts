import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExportRoutingModule } from './export-routing.module';
import { SidebarComponent } from '../core/sidebar/sidebar.component';
import { HeaderComponent } from '../core/header/header.component';
import { CoreModule } from '../core/core.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ExportRoutingModule,
    CoreModule
  ]
})
export class ExportModule { }
