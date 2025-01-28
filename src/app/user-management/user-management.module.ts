import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BrowserAnimationsModule, // Required for Angular Material animations
    MatSlideToggleModule,     // Import MatSlideToggleModule here
    UserManagementRoutingModule,
  ],
  
})
export class UserManagementModule { }
