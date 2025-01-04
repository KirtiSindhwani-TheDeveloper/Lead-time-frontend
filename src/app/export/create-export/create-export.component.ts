import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PrimengModule } from '../../shared/primeng/primeng.module';
import { MessageService, SharedModule } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { UtilitiesService } from '../../services/utilities.service';
import { ExportService } from '../../services/export.service';
import { SidebarComponent } from '../../core/sidebar/sidebar.component';

@Component({
  selector: 'app-create-export',
  imports: [
    PrimengModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    SidebarComponent
  ],
  providers:[MessageService],
  templateUrl: './create-export.component.html',
  styleUrl: './create-export.component.css',
})
export class CreateExportComponent {
  loading:boolean=false;
  brands: any[] = [];
  locations: any[] = [];
  dealers: any[] = [];
  categories: any[] = [{name:'Spare Part'},{name:'Genuine Accessory'}];
  fileTypes: any[] = [{name:'Partwise OrderType'},{name:'Partwise Summary'},{name:'Overall Summary'},{name:'M1 Month'}];
  minDate: Date | undefined;
  maxDate: Date | undefined;
  exportForm: FormGroup = new FormGroup({
    brand: new FormControl('',[Validators.required]),
    dealer: new FormControl('',[]),
    location: new FormControl('',[]),
    category: new FormControl('',[Validators.required]),
    fromMonth: new FormControl('',[Validators.required]),
    toMonth: new FormControl('',[Validators.required]),
    fileType: new FormControl('',[Validators.required]),
  });
  constructor(private utilitiesService:UtilitiesService,
    private exportService:ExportService,
  private messageService:MessageService){

  }

  downloadExcel() {
    if(this.exportForm.valid){
     
      this.loading=true;
      this.exportService.exportExcel(this.exportForm.value).subscribe({next:(response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'multi_sheets.xlsx'; // Set the name of the downloaded file
        a.click();
        window.URL.revokeObjectURL(url);
        this.loading=false
      },
      error:(error:any)=>{
        this.loading=false;
        this.messageService.add({severity:'error',summary:'There is no result available for this brand',life:3000})
      }
    },
    );   
    }
    else{
      Object.keys(this.exportForm.controls).forEach(controlName => {
        this.exportForm.get(controlName)?.markAsTouched();
      });
      console.log('Form is invalid');
    }
  }
  

  ngOnInit() {
    let today = new Date();

    //  this.maxDate = new Date(today);
    //  this.maxDate.setDate(today.getDate());
    //  this.minDate=new Date(today);
    //  this.minDate.setDate(1);
    //  this.maxDate.setDate(0);
    // this.minDate.setMonth(today.getMonth() - 15);
    this.maxDate = new Date(today);
this.maxDate.setMonth(today.getMonth() + 1);
this.maxDate.setDate(0); // Last day of the current month

// Set minDate to 15 months ago
this.minDate = new Date(today);
this.minDate.setMonth(today.getMonth() - 15);
this.minDate.setDate(1); // Set minDate to the first day of the month



// Adjusting minDate in case it goes past the previous year and handles edge cases (like the 31st -> February 28/29)
// if (this.minDate.getMonth() > today.getMonth()) {
//   this.minDate.setFullYear(today.getFullYear() - 1);
// }
 // Ensure that the minDate is not later than the maxDate

this.getBrands(); 
    console.log('Min Date: ', this.minDate.toISOString().split('T')[0]);
    console.log('Max Date: ', this.maxDate.toISOString().split('T')[0]);
  }

   formatDate(date:any) {
    let day = date.getDate();
    let month = date.getMonth() + 1; // Months are zero-indexed
    let year = date.getFullYear();
  
    // Pad single digit day or month with a leading zero
    return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
  }

 
   getBrands(){   
     this.utilitiesService.getBrands().subscribe((res:any)=>{
       this.brands=res.data;
       
     })
     
   }
  
   getDealers(event:any){
     let brand_id=this.exportForm.value.brand;
     
     this.utilitiesService.getDealers({brand_id:brand_id}).subscribe((res:any)=>{
       this.dealers=res.data;
     })
 

   }
 
   getLocations(event:any){
     this.utilitiesService.getLocations({brand_id:this.exportForm.value.dealer,dealer_id:this.exportForm.value.dealer}).subscribe((res:any)=>{
       this.locations=res.data;
     })
   }
  
}
