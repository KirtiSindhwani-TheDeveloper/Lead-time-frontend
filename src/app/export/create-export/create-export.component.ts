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
import * as FileSaver from 'file-saver';
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
  brand:any;dealer:any;location:any;
  brands: any[] = [];
  locations: any[] = [];
  dealers: any[] = [];
  categories: any[] = [{name:'Spare Part'},{name:'Genuine Accessory'}];
  fileTypes: any[] = [{name:'Partwise OrderType'},{name:'Partwise Summary'},{name:'Overall Summary'},{name:'M1 Month'}];
  minDate: Date | undefined;
  maxDate: Date | undefined;
  currentDateTime:any;
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
      const brandObj=this.brands.find((obj:any)=>{
        return obj.brand_id==this.exportForm.value.brand;
      })
      this.brand=brandObj?.brand;
      if(this.exportForm.value.dealer!=null){
        const dealerObj=this.dealers.find((obj:any)=>{
          return obj.dealer_id==this.exportForm.value.dealer;
        })
        this.dealer=dealerObj?.dealer_name;

      }
    if(this.exportForm.value.location){
      const locationObj=this.locations.find((obj:any)=>{
        return obj.Location_id==this.exportForm.value.location;
      })
      this.location=locationObj.Location_name
    }

      this.exportService.exportExcel(this.exportForm.value).subscribe((response: any) => {
        // Create a URL for the blob
        console.log(response)
        let fileName='Lead time Output_'+this.brand;
        if(this.dealer!=null){
          fileName+="_"+this.dealer+"_"
        }
        if(this.location!=null)
        {
          fileName+=this.location+'_';
        }
       fileName+=this.currentDateTime
      // Trigger the download for file1
      this.downloadFile(response, fileName);  // Adjust the name as needed
      this.exportService.downloadLogs(this.exportForm.value).subscribe((res:any)=>{
        let fileName='Error_Logs_'+this.brand;
          if(this.dealer!=null){
            fileName+="_"+this.dealer+"_"
          }
          if(this.location!=null)
          {
            fileName+=this.location+'_';
          }
         fileName+=this.currentDateTime
        this.downloadFile(res,fileName);
        this.loading=false;
       }
      //  , error => {
      //   this.loading=false;
      //   this.messageService.add({ severity: 'error', summary: 'Error occured in processing excel file', life: 20000 });
      //   console.error('Error downloading files', error);
      // }
    )
      
    }, error => {
      this.loading=false;
      this.messageService.add({ severity: 'error', summary: 'Error occured in processing excel file', life: 20000 });
      console.error('Error downloading files', error);
    });
     
    
    }
    else{
      Object.keys(this.exportForm.controls).forEach(controlName => {
        this.exportForm.get(controlName)?.markAsTouched();
      });
      console.log('Form is invalid');
    }
  }
  private downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;  // Set the filename for the download
    a.click();
    window.URL.revokeObjectURL(url);  // Clean up after download
   
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


const now = new Date();
    this.currentDateTime = now.toLocaleString();
  console.log(this.currentDateTime)
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
