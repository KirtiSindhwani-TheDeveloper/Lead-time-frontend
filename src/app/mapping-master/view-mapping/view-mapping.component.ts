import { Component, Inject } from '@angular/core';
import { UtilitiesService } from '../../services/utilities.service';
import { Subscription } from 'rxjs';
import { PrimengModule } from '../../shared/primeng/primeng.module';
import { MessageService, SharedModule } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { DialogService, DynamicDialogComponent, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateMappingComponent } from '../create-mapping/create-mapping.component';
import { MappingMasterService } from '../../services/mapping-master.service';

@Component({
  selector: 'app-view-mapping',
  imports: [PrimengModule,SharedModule,CommonModule],
  providers:[DialogService,MessageService],
  templateUrl: './view-mapping.component.html',
  styleUrl: './view-mapping.component.css'
})
export class ViewMappingComponent {
  userId:any;
  isLoading:boolean=false;
  activeBrands:any;
  brandColumns:any;
  receivedData:any;
  duplicates:any = [];
  isDuplicateBrandColumns:any=false;
  brand:any;
  fileType:any;
  fileName:any;
  fileTypeId:any;
  private dataSubscription:any;
  instance: DynamicDialogComponent | undefined;
  constructor(private utilitiesService:UtilitiesService,
    public ref: DynamicDialogRef, private mappingService:MappingMasterService,@Inject(DynamicDialogConfig) private config: DynamicDialogConfig
    ,private messageService:MessageService
  ){

    this.activeBrands=config.data;
  }
  ngOnInit(): void {


    console.log("active brands ",this.activeBrands);
    this.brand=this.activeBrands.brand;
    this.fileName=this.activeBrands.fileName;
    this.fileType=this.activeBrands.fileType
    this.fileTypeId=this.activeBrands.id;
    this.receivedData = this.activeBrands?.data.rows;
    this.receivedData=  this.receivedData.sort((a:any, b:any) => a.sequence - b.sequence);

    this.brandColumns=this.activeBrands.brands
    this.activeBrands = this.receivedData.filter((row:any) => {
      return row.selected === true && row.selectedBrand!=0
    } )        
    // console.log("filtered brands ",this.activeBrands)
        this.activeBrands=this.activeBrands.map((row1:any) => ({
         
          ...row1,
          brandColumns:this.brandColumns,
          brandColumnName: this.getBrandColumnName(row1.selectedBrand)
           // Map the selectedBrand ID to the name
        }));
    
        console.log("active brands ",this.activeBrands);
        this.isDuplicateBrandColumns=false;
        this.checkDuplicates(this.activeBrands)
  }

  ngOnChange(){
    this.checkDuplicates(this.activeBrands)
  }

  close() {
    this.ref.close();
    this.duplicates=[]
    this.isDuplicateBrandColumns=false;
}

ngOnDestroy() {
    if (this.ref) {
        this.ref.close();
    }
}
  getBrandColumnName(id:any){

   const brand= this.brandColumns.find((row:any)=>row.id==id);
  //  console.log("brand ",brand.name)
   return brand.name
  }
  closeDialog(data:any) {
    this.utilitiesService.showModal(false); //
    // this.isView=false;
    this.ref.close(data);
}
onSubmit(data:any){
    // this.isView=true;
    if(this.duplicates.length==0){
     
      this.utilitiesService.showModal(true); //
      this.isLoading=true;
      this.userId=localStorage.getItem('userId')
      this.mappingService.addColumns({data:this.activeBrands,brand:this.brand,fileName:this.fileName,fileType:this.fileType,brandColumns:this.brandColumns,id:this.fileTypeId,userId:this.userId}).subscribe({
        
        next:(res:any)=>{
          this.isLoading=true;
          if(res.status==200){
            // console.log(res)
            // this.messageService.add({severity:'info',summary:'Your data is successfully saved',life:3000})
            this.ref.close({
              status: 200, // Example success status
              message: 'Data saved successfully'
            });
          }
          
  
        },
        error:(err:any)=>{
          this.isLoading=false;
          // this.messageService.add({severity:'error',summary:'Your data is not saved due to some error',life:3000})
          this.ref.close({
            status: 200, // Example success status
            message: 'Data saved successfully'
          });
        }
      }
      );
    }
    else{
      // this.isDuplicateBrandColumns=true;
    }
    
}

checkDuplicates(activeBrands:any) {
  this.duplicates = [];
  this.isDuplicateBrandColumns = false;
  const seenNames = new Set();
 

  for (const obj of activeBrands) {
    if (seenNames.has(obj.brandColumnName)) {
      this.isDuplicateBrandColumns=true;
      this.duplicates.push(obj.brandColumnName);  // If it's already seen, it's a duplicate
    } else {
      // this.isDuplicateBrandColumns=false;
      seenNames.add(obj.brandColumnName);  // Otherwise, add it to the set
    }
  }

  return this.duplicates;  // Return all duplicates found
}
}
