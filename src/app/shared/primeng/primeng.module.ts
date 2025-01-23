import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputNumber, InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BlockUIModule } from 'primeng/blockui';
import { PasswordModule } from 'primeng/password';
import { InputOtpModule } from 'primeng/inputotp';
import { TieredMenuModule } from 'primeng/tieredmenu';
const modules=[
  DropdownModule,
  InputTextModule,
  FileUploadModule,
  ButtonModule,
  ToastModule,
  TableModule,
  DialogModule,
  DynamicDialogModule,
  InputNumberModule,
  CheckboxModule,
  CalendarModule,
  MultiSelectModule,
  ProgressSpinnerModule,
  BlockUIModule,  
  PasswordModule,
  InputOtpModule,
  TieredMenuModule
]
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ...modules
  ],
  exports:[
    ...modules
  ],
  
})
export class PrimengModule { }
