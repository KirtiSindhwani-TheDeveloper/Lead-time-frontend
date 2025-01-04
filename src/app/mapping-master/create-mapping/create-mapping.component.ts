import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, forwardRef, Input, OnInit } from '@angular/core';
import { PrimengModule } from '../../shared/primeng/primeng.module';
import { MessageService, SharedModule } from 'primeng/api';
import { AbstractControl, ControlValueAccessor, FormArray, FormBuilder, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { UploadEvent } from 'primeng/fileupload';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Footer } from '../footer';
import { UtilitiesService } from '../../services/utilities.service';

import { MappingMasterService } from '../../services/mapping-master.service';
import { ViewMappingComponent } from '../view-mapping/view-mapping.component';
import { SidebarComponent } from '../../core/sidebar/sidebar.component';




@Component({
  selector: 'app-create-mapping',
  imports: [CommonModule,PrimengModule,SharedModule,FormsModule,ReactiveFormsModule,SidebarComponent],
  providers:[MessageService,DialogService,UtilitiesService],
  templateUrl: './create-mapping.component.html',
  styleUrl: './create-mapping.component.css',
 
})
export class CreateMappingComponent{
  isLoading:boolean=false;
  brandColumns:any=[]
  filePath:any;
  showTable:boolean=false;
  isActive:boolean=false;
  isView:any;
  selectedBrandColumn:any;
  selectedBrand:any;
  fileName:any;
  brands:any=[]
  fileType:any=[{id:1,name:"PO"},{id:2,name:"MRN"}];
  selectedFileType:any;
  fileInput:any;
  showEditField:boolean=false;
  visibleModal:boolean=false;
  private dataSubscription!: any;
  mappingForm:FormGroup;
  rows:any;
  fileTypeForm:FormGroup;
  ref: DynamicDialogRef | undefined;
  value: any;
 formData:any;


  constructor(public dialogService: DialogService, public messageService: MessageService,
    private utilitiesService:UtilitiesService,
    private cdRef: ChangeDetectorRef,
  private mappingService:MappingMasterService,private fb:FormBuilder) {
    this.mappingForm = this.fb.group({
      rows: this.fb.array([]), // Empty FormArray
     
    });
    this.fileTypeForm=this.fb.group({
      brands: ['', Validators.required],
      fileType: ['', Validators.required],
      fileName: ['', Validators.required],
      file:['',Validators.required]

    })
   
  }

 
  getFileTypes(event:any){
    this.utilitiesService.getFileType({brand_id:this.fileTypeForm.value.brands}).subscribe((res:any)=>{
      this.fileType=res.data;
    })
    
  }

  ngOnInit(){
    this.dataSubscription = this.utilitiesService.data$.subscribe(
      (newData) => {
        this.isView = newData;
      }
    );
    this.initializebrandColumns();
    this.getBrands();
    
  }
  addRow(row: any) {
    const rowGroup = this.fb.group({
      selectedBrand: [row.selectedBrand, Validators.required],
      selected: [row.selected],
      sequence: [row.sequence, [Validators.required, Validators.min(1), Validators.max(this.brandColumns.length)]]
    });

    this.rowsArray.push(rowGroup);
  }

  addControlsToForm() {
    if (this.rowsArray) {
      const rowGroup = this.fb.group({
        selectedBrand: [ Validators.required],
        selected: [false],
        sequence: [ [Validators.required, Validators.min(1), Validators.max(this.brandColumns.length)]]
      });
  
      // Push the row group into the FormArray
       this.rowsArray.push(rowGroup);
    } else {
      console.error('rowsArray is null or undefined');
    }
  }


  onRowSelectChange(row: any) {
    // If all rows are selected, set the "Select All" checkbox to true
    this.isActive = this.brandColumns.every((r:any) => r.selected);
  }
  onUpload(event: any) {
    // console.log("files ",event);
    const file=event.currentFiles[0]
    this.fileTypeForm.get('file')?.patchValue(file); 
    this.fileName=file.name;
    this.formData = new FormData();
    this.formData.append('excelFile', file, this.fileName);
    // console.log(formData)
    
}
showDialog() {
  this.visibleModal = true;
}

    show() {
      let fileTypeObj;
      fileTypeObj=this.fileType.find((obj:any)=>{
        // console.log("id ",obj.id,this.locationFormGroup.value.fileType)
     return  obj.fileType==this.fileTypeForm.value.fileType && obj.brandID==this.fileTypeForm.value.brands
    })
    console.log("file ",fileTypeObj)
      this.utilitiesService.emitData({data:this.mappingForm.value,brands:this.brandColumns});
      console.log('Form Submitted:', this.mappingForm.value);
     
      console.log(this.fileTypeForm.value)
      this.ref = this.dialogService.open(ViewMappingComponent, {
         
            header: 'Mapped Columns',
            width: '50vw',
            contentStyle: { overflow: 'auto' },
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            },
            data: {
              data:this.mappingForm.value,
              brands:this.brandColumns,
              brand:this.fileTypeForm.value.brands,
              fileType:this.fileTypeForm.value.fileType,
              fileName:this.fileTypeForm.value.fileName,
              id:fileTypeObj.id
          },
            // templates: {
            //     footer: Footer
            // }
        });

        this.ref.onClose.subscribe((data: any) => {
          // console.log(data)
          if (data) {
            this.showTable=false; 
            this.formData=new FormData();
            this.fileName=''
            if (data.status === 200) {
              // Success case
              this.messageService.add({
                severity: 'success',
                detail: data.message,
                life: 3000
              });
            } else {
              // Error case
              this.messageService.add({
                severity: 'error',
                summary: 'Something went wrong',
                detail: `Error: ${data.message}`,
                life: 3000
              });
            }
        }});

        this.ref.onMaximize.subscribe((value) => {
            // this.messageService.add({ severity: 'info', summary: 'Maximized', detail: `maximized: ${value.maximized}` });
        });
    }

    ngOnDestroy() {
        if (this.ref) {
            this.ref.close();
        }
    }

    getBrands(){
      this.utilitiesService.getBrands().subscribe((res:any)=>{
        this.brands=res.data;
      })
    }

    uploadFile(data:any){
      
      this.mappingService.uploadFile(data).subscribe((res:any)=>{
        this.showTable=true; 
        this.filePath=res.filePath
        this.brandColumns = res.data.map((item: string, index: number) => ({
          id:index+1,
          name: item,          
          sequence: index + 1,   
          sequenceChanged: false ,
          selectedBrand:0
        }));
        // this.fileTypeForm.get('file')?.patchValue(null); 
        this.isLoading=false;
        this.initializebrandColumns()
        // this.checkSequenceUniqueness();
         this.initializeForm()
      })
    }



getRow(i: number): FormGroup {
  return this.rowsArray.at(i) as FormGroup;
}



onSubmit() {
  let fileTypeObj
  // if(!this.fileName){
  // return  this.messageService.add({ severity: 'error',  summary: 'Warning', detail: 'Select the file', life: 3000})
  // }
  if (this.fileTypeForm.valid ) {
   this.isLoading=true;
    this.uploadFile(this.formData);
       
    console.log('Form Submitted:', this.mappingForm.value);
    console.log(this.fileTypeForm.value)
  } else {
      
    Object.keys(this.fileTypeForm.controls).forEach(controlName => {
      this.fileTypeForm.get(controlName)?.markAsTouched();
    });
    console.log('Form is invalid');
  }
}
onEdit(){
  this.showEditField=true;
  if (this.mappingForm.valid) {
    console.log('Form Submitted:', this.mappingForm.value);
    console.log(this.fileTypeForm.value)
  } else {
    console.log('Form is invalid');
  }
}

initializebrandColumns() {
  this.brandColumns.forEach((row: any, index: number) => {
    row.sequence = index + 1; // Set initial sequence to be unique
    row.sequenceChanged = false; // Initialize sequenceChanged flag
    // console.log("rqo. equence ",row.sequence)
  });

}



onSequenceChange(row: any, index: number): void { 
  row.sequenceChanged = true;
//  console.log(row)
 let sequenceControl
 sequenceControl = (this.rowsArray.at(index) as FormGroup).get('sequence');
 this.clearAllSequenceErrors();
//  console.log("row sequence ",row.sequence,row);
  if (!this.isUnique(row.sequence, row)) {
    
    sequenceControl?.setErrors({sequenceNotUnique:true});
    // this.messageService.add({ severity: 'error',  summary: 'Warning', detail: 'Sequence is not correct', life: 3000})
  }
  else{
    sequenceControl?.setErrors(null);
    
    // sequenceControl?.clearErrors(); 
  }
 
    if (this.sequenceExists(sequenceControl?.value, index)) {
      sequenceControl?.setErrors({ sequenceNotUnique: true });
    }
    else{
      sequenceControl?.setErrors(null);
    }

    this.cdRef.detectChanges();
 
}

sequenceExists(sequence: number, rowIndex: number): boolean {
  return this.rowsArray.controls.some((control, index) => {
    console.log("control ",sequence,control.value.sequence,"index ",index)
    // return control.get('sequence')?.value === sequence && index !== rowIndex;
    return control.value.sequence===sequence && index!=rowIndex
  });
}


isUnique(sequence: number, rowIndex: number): boolean {
  return !this.sequenceExists(sequence, rowIndex);
}

clearAllSequenceErrors(): void {
  // Loop through each control and remove errors if there are any
  this.rowsArray.controls.forEach((control: any) => {
    const sequenceControl = control.get('sequence');
    sequenceControl?.setErrors(null);  // Clear any errors on the sequence control
  });
}




initializeForm(){
  this.mappingForm = this.fb.group({
    rows: this.fb.array([])   ,   // Initialize the form array for inputs
   
  });
  this.brandColumns.forEach((row:any) => {
    this.addRow(row);
  });
  this.addControlsToForm()
  
}

createRowFormGroup(row: any): FormGroup {
  return this.fb.group({
    selectedBrand: [row.selectedBrand, Validators.required], // Dropdown
    selected: [row.selected], // Checkbox
    sequence: [row.sequence, [Validators.required, Validators.min(1), Validators.max(this.brandColumns.length)]], // Sequence Input
  });
}

// Get the rows FormArray
get rowsArray(): FormArray {
  return this.mappingForm?.get('rows') as FormArray;
}

isFieldInvalid(field: string, index: number) {
  const control = this.rowsArray.at(index).get(field);
  return control?.invalid && (control?.touched || control?.dirty);
}
}
