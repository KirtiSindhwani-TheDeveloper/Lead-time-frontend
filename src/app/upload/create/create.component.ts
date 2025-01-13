import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimengModule } from '../../shared/primeng/primeng.module';
import { MessageService, SharedModule } from 'primeng/api';
import { CommonModule, DatePipe } from '@angular/common';
import { SidebarComponent } from '../../core/sidebar/sidebar.component';
import { UtilitiesService } from '../../services/utilities.service';
import { MappingMasterService } from '../../services/mapping-master.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MappingComponent } from '../mapping/mapping.component';
import { isValidDate } from 'rxjs/internal/util/isDate';
import { UploadService } from '../../services/upload.service';
import { ExportService } from '../../services/export.service';
import * as XLSX from 'xlsx';
import { FileUpload } from 'primeng/fileupload';
import { UserService } from '../../services/user.service';
import { switchMap } from 'rxjs';
import { brandColumnObject } from '../../core/brandColumns';
import { HeaderComponent } from '../../core/header/header.component';
@Component({
  selector: 'app-create',
  imports: [PrimengModule,SharedModule,ReactiveFormsModule,FormsModule,CommonModule,SidebarComponent,HeaderComponent],
  providers:[DialogService,MessageService,DatePipe],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {
 isFileUploaded:boolean=false;
  updatedLogs:any= [];
 isMappedColumnPresent:boolean=false;
 isScreenCollapsed:boolean=false;
 fileNames:any=[];
  brands:any;
  formData:any;
  dealers:any;
  locations:any;
  fileName:any;
  brand:any;
  dealer:any;
  location:any;
  users:any;
  updatedDate:any;
  fetchData:any;
  isLocationWiseChecked:any;
  fileTypes:any[]=[]
  uploadLogs:any;
  ref: DynamicDialogRef | undefined;
  showMapping:boolean=false;
  showTable:boolean=false;
  showDownloadFormat:boolean=false;
  uploadedDetails:any=[]
  uploadedData:any;
  uploadedFiles:any;
  excelCount:any;
  userId:any;
  formDataPO:any;
  updatedBy:any;
  updatedAuditLogs:any=[];
  isLoading:boolean=false;
  isSearchButton:boolean=false;
  locationFormGroup:FormGroup;
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  uploadForm: FormGroup = new FormGroup({

    brand: new FormControl('',[Validators.required]),
    dealer: new FormControl('',[Validators.required]),
    location: new FormControl('',[Validators.required]),
    // fileType:new FormControl('',[]),


  })

  
  constructor(private utilitiesService:UtilitiesService,private mappingService:MappingMasterService,
    public dialogService: DialogService, public messageService: MessageService,
    private uploadService:UploadService,private fb:FormBuilder,
    private exportService:ExportService,
    private userService:UserService,
    private datePipe: DatePipe

  ){
    this.locationFormGroup=this.fb.group({

      brand:['',[Validators.required]],
      // fileType:['',[Validators.required]]
    })
  }

  ngOnInit(){
   this.getBrands(); 
   this.getUsers();
  }
  onBrandSelect(brand: string): void {
    this.fileTypes=[]
    this.getFileType({brand_id:brand});
    this.fileNames=[]
    this.showDownloadFormat=true;
    this.uploadForm.get('fileType')?.patchValue(2);
  }
  
  getBrands(){
    let brand_id=this.locationFormGroup.value.brand;
    this.utilitiesService.getBrands().subscribe((res:any)=>{
      this.brands=res.data;
      
    })
    
  }

  getDealers(event:any){
    let brand_id=this.uploadForm.value.brand;
    // this.getFileType({brand_id:brand_id});
    this.utilitiesService.getDealers({brand_id:brand_id}).subscribe((res:any)=>{
      this.dealers=res.data;
    })
    this.getFileType({brand_id:this.uploadForm.value.brand})
    // this.fetchMappedColumns({brand_id:brand_id,fileTypeId:this.uploadForm.value.fileType})
  }

  getLocations(event:any){
    this.utilitiesService.getLocations({brand_id:this.uploadForm.value.brand,dealer_id:this.uploadForm.value.dealer}).subscribe((res:any)=>{
      this.locations=res.data;
    })
   
  }

  onCheckboxChange(event: any): void {
    if (this.isLocationWiseChecked) {
      // Reset the table or clear its data
     this.uploadLogs=[]  // Clearing the table
     this.showTable=false;
     this.isSearchButton=false;
     this.updatedAuditLogs=[]
     this.showMapping=false;
     this.fileTypes=[];
     this.fileNames=[];
     this.uploadForm.reset();

    } if(!this.isLocationWiseChecked){
      this.showTable=false;
      this.uploadLogs=[];
      this.updatedAuditLogs=[]
      this.showTable=false;
      this.isSearchButton=false;
      this.showMapping=false;
      this.fileTypes=[];
      this.fileNames=[];
      this.locationFormGroup.reset();
    }
    }
//   onUpload(event: any) {
//     this.fileUpload.clear();
//     // console.log("files ",event);
//     const file=event.currentFiles[0]
//     this.fileName=file.name;
//      this.formData = new FormData();
//     this.formData.append('excelFile', file, this.fileName);
//     console.log(this.formData)
//     this.isFileUploaded=true;
//     // console.log(formData)
//     // this.uploadFile(formData)
//     // this.submit(formData)
// }

onUpload(event: any, fileType: any, index: number) {
  // Clear the previous file upload instance
  this.fileName=''
  this.updatedAuditLogs=[];
  
  this.fileUpload.clear();

  // Get the uploaded file
  const file = event.currentFiles[0];
  this.fileName = file.name;
  
  // Create a new FormData object for each file type upload
  const formData = new FormData();
  formData.append('excelFile', file, this.fileName);

  // // Optionally, associate the uploaded file with the file type
  if (!this.uploadedFiles) {
      this.uploadedFiles = [];
  }


  this.uploadedFiles.length=this.fileTypes.length
  this.uploadedFiles[index] = {
      fileTypeId:fileType.id,
      fileType: fileType.fileType,
      file: formData,
      fileName:this.fileName
  };
  this.uploadedFiles.forEach((item:any, index:any) => {
    this.fileNames[index]=item.fileName;
    
  });
   //console.log(this.fileNames)
  console.log(this.uploadedFiles)
  if(this.fileTypes.length !=this.uploadedFiles.length){
     console.log("size not equal for uploaded file and file types ",this.fileTypes.length ,this.uploadedFiles.length)
    this.isFileUploaded=false;
  }
  else{
    this.isFileUploaded=true;
  }
  // console.log('Uploaded file for file type:', fileType.fileType);
  // console.log('FormData:', formData);

  // Flag to indicate the file has been uploaded
  // this.isFileUploaded = true;
}


async uploadFile(data:any){

  let fileTypeObj;
this.isLoading=true
  // if(!this.isLocationWiseChecked){   
  //     fileTypeObj=this.fileTypes.find((obj:any)=>{
  //       // console.log("id ",obj.id,this.locationFormGroup.value.fileType)
  //    return  obj.id==this.locationFormGroup.value.fileType
  //   })
  //   console.log(fileTypeObj);
  // }
  // else{
  //   fileTypeObj=this.fileTypes.find((obj:any)=>{
  //     // console.log("id ",obj.id,this.uploadForm.value.fileType)
  //  return  obj.id==this.uploadForm.value.fileType})
  // }

  this.userId=localStorage.getItem('userId');
  let logs;
  for(let item of this.uploadedFiles){
    this.formData=item.file;
    let fileTypeObj=item;
    console.log(this.formData)
    
      this.mappingService.uploadFile(this.formData).subscribe(async (res:any)=>{
        this.isFileUploaded=false
        this.uploadedData=res.data1
        this.excelCount=res.data1.length
        // console.log("this.ex" ,this.excelCount)
        this.isLoading=true;
        if(!this.isLocationWiseChecked){
          // console.log("jsfhd",fileTypeObj)
       logs=  await this.uploadData({brand_id:this.locationFormGroup.value.brand,filePath:res.filePath,mappedData:this.fetchData,fileType:fileTypeObj.fileType,fileTypeId:fileTypeObj.fileTypeId,rowCount:this.excelCount,userId:this.userId},fileTypeObj)
          this.formData = new FormData();
        }else{
          // console.log("jsfhd upload",fileTypeObj)
        logs=await  this.uploadData({brand_id:this.uploadForm.value.brand,dealer_id:this.uploadForm.value.dealer,location:this.uploadForm.value.location,filePath:res.filePath,fileType:fileTypeObj.fileType,fileTypeId:fileTypeObj.fileTypeId,rowCount:this.excelCount,userId:this.userId},fileTypeObj)
          this.formData = new FormData();
        }
      },
    (error)=>{
      this.messageService.add({severity:'error',summary:`You have selected the wrong file for ${fileTypeObj.fileType}`,life:100000})
    })
    
    // console.log("upload logs ",logs)
  }

  return logs

  


}

show() {

  console.log('Form Submitted:', this.uploadForm.value);

  this.ref = this.dialogService.open(MappingComponent, {
     
        header: 'View Column Mapping',
        width: '50vw',
        contentStyle: { overflow: 'auto' },
        breakpoints: {
            '960px': '75vw',
            '640px': '90vw'
        },
        data: {
          data:this.fetchData,
        brands:this.brands,
        }
    
    });
}

 async fetchMappedColumns(data:any){
//  await this.mappingService.fetchData(data).subscribe((res:any)=>{
//     this.showMapping=true;
//     this.fetchData=res.data;
    // if(this.fetchData.length!=0){
    //   this.isMappedColumnPresent=true
      // this.fetchData.forEach((item:any) => {
      //   const file = this.fileTypes.find(fileType => fileType.id === item.file_type);
      //    item.fileTypeName = file ? file.fileType : 'Unknown File';

        
      //   // console.log(`File ID: ${item.file_type}, File Name: ${fileName}`);
      // });
      this.isLoading=true;
     
      this.uploadFile(this.formData)
      
    // }
    // else{
    //   this.isLoading=false
    //   this.messageService.add({severity:'error',summary:'Column mapping is not available for this brand and file type',life:3000})
    // }
 
  //})
}

  async getMappedColumns(data:any){
    this.isLoading=true;
  let brandId=data.brand;
  let fileTypeId=data.fileType;
  // this.getFileType({brand_id:brandId});
 await this.fetchMappedColumns({brand_id:brandId,fileTypeId:fileTypeId})
}

search(){
  
    // this.showTable=true;
    // this.isScreenCollapsed=true;
}

  // async submit(){
  
  //   this.isLoading=true;
  // // console.log("is checked ",this.isLocationWiseChecked);
  // this.isSearchButton=false;
  // this.showTable=false;
  // this.updatedLogs=[];
  // if(!this.isLocationWiseChecked){
  //   if(this.locationFormGroup.valid){
  //      await this.getMappedColumns(this.locationFormGroup.value)
      
  //         // this.uploadService.getUploadedDetails({...this.locationFormGroup.value,mappedData:this.fetchData}).subscribe((res:any)=>{
  //         //   this.uploadedDetails=res.data
            
  //           const brandObj=this.brands.find((obj:any)=>{
  //             return obj.brand_id==this.locationFormGroup.value.brand;
  //           })
  //           this.brand=brandObj.brand;
  //           this.isLoading=true;
  //         setTimeout(()=>{
  //           this.uploadService.uploadLogs({...this.locationFormGroup.value,userId:this.userId}).subscribe({
  //           next:(res: any) => {
  //             this.isScreenCollapsed=true
  //             this.isSearchButton=true;
  //             this.uploadLogs = res.data;
  //             this.uploadLogs.forEach((item: any) => {
  //               this.updatedDate = this.datePipe.transform(item.dateTime, 'yyyy-MM-dd')!;
  //               console.log("updated ", this.updatedDate);
  //               let user = this.users.find((obj: any) => { return obj.userId == item.userID; });
  //               this.updatedBy = user.name;
  //               this.updatedLogs.push({
  //                 ...item,
  //                 updatedDate: this.updatedDate,
  //                 updatedBy: this.updatedBy,
  //                 // Keep the original log data too, if needed
  //               });
  //               this.isSearchButton = true;
  //               this.showTable=true;
  //               this.isLoading=false;
  //               this.formData = new FormData();
  //             });
             
  //             // this.locationFormGroup.reset()
  //           },
  //           error:(error:any)=>{
  //             this.isLoading=false;
  //           }
  //         })

  //          },9000)
          
  //   }
  //   else{
  //     this.isLoading=false;
  //     Object.keys(this.locationFormGroup.controls).forEach(controlName => {
  //       this.locationFormGroup.get(controlName)?.markAsTouched();
  //     });
  //     this.messageService.add({severity:'error',summary:'Kindly fill all the information.',life:3000})
  //     console.log('Form is invalid');
  //   }
  // }
  // if(this.isLocationWiseChecked){

  //   if(this.uploadForm.valid){
  //      await this.getMappedColumns(this.uploadForm.value)
  //     // this.uploadFile(this.formData)
     
  //         const brandObj=this.brands.find((obj:any)=>{
  //           return obj.brand_id==this.uploadForm.value.brand;
  //         })
  //         this.brand=brandObj.brand;
    
  //         const dealerObj=this.dealers.find((obj:any)=>{
  //           return obj.dealer_id==this.uploadForm.value.dealer;
  //         })
  //         this.dealer=dealerObj.dealer_name;
    
  //         const locationObj=this.locations.find((obj:any)=>{
  //           return obj.Location_id==this.uploadForm.value.location;
  //         })
  //         this.location=locationObj.Location_name
  //         // Creating an array to store the mapping for each log entry
  //         this.isLoading=true;
  //          setTimeout(()=>{
  //            this.uploadService.uploadLogs({...this.uploadForm.value,userId:this.userId}).subscribe({
  //            next:(res:any)=>{
  //             this.isScreenCollapsed=true
  //             this.isSearchButton=true;
  //              this.uploadLogs=res.data;
  //              this.uploadLogs.forEach((item:any)=>{
  //                const dateObj = item.dateTime
       
  //                this.updatedDate = this.datePipe.transform(item.dateTime, 'yyyy-MM-dd')!;
  //                console.log("updated ",this.updatedDate)
  //                let user=this.users.find((obj:any)=>{return obj.userId==item.userID})
  //                this.updatedBy=user.name;
  //                this.updatedLogs.push({
  //                  ...item ,
  //                  updatedDate: this.updatedDate,
  //                  updatedBy: this.updatedBy,
  //                  // Keep the original log data too, if needed
  //              });
  //              })
  //              this.showTable=true;
  //             //  this.uploadForm.reset();
  //             this.isLoading=false;
  //              this.formData = new FormData();
  //            },
  //           error:(erro:any)=>{
  //             this.isLoading=false;
  //           }})

  //          },9000)
          
          
        
        
      
  //     // this.uploadService.getUploadedDetails({...this.uploadForm.value,mappedData:this.fetchData}).subscribe((res:any)=>{
  //     //   this.uploadedDetails=res.data
  //     //   // this.formData = new FormData();
  //     // })
      
     
  //   }
  //   else{
  //     this.isLoading=false;
  //     Object.keys(this.uploadForm.controls).forEach(controlName => {
  //       this.uploadForm.get(controlName)?.markAsTouched();
  //     });
  //     this.messageService.add({severity:'error',summary:'Kindly fill all the information.',life:3000})
  //     console.log('Form is invalid');
  //   }
  // }

  // }

  async submit(){
   this.fileNames=[];
    this.isLoading=true;
    this.updatedAuditLogs=[];
    if(!this.isLocationWiseChecked){
      if(this.locationFormGroup.valid){
          this.isLoading=true;
          this.updatedAuditLogs=[];
          await this.uploadFile(this.formData)        
          this.uploadedFiles=[];
          this.fileNames=[];
            //  this.fileTypes=[];  
        }
        else{
              this.isLoading=false;
              Object.keys(this.locationFormGroup.controls).forEach(controlName => {
                this.locationFormGroup.get(controlName)?.markAsTouched();
              });
              // this.messageService.add({severity:'error',summary:'Kindly fill all the information.',life:3000})
              console.log('Form is invalid');
            }
      }
        else{
          if(this.uploadForm.valid){
                      this.isLoading=true;   
                      this.updatedAuditLogs=[];
           let logs= await this.uploadFile(this.formData) 
           this.fileNames=[];
           this.uploadedFiles=[];
            // this.fileTypes=[];      

               
    }
    else{
      this.isLoading=false;
          Object.keys(this.uploadForm.controls).forEach(controlName => {
            this.uploadForm.get(controlName)?.markAsTouched();
          });
          // this.messageService.add({severity:'error',summary:'Kindly fill all the information.',life:3000})
          // console.log('Form is invalid');
    }
  }
        
  }


downloadExcel(){
  this.isLoading=true;
  console.log("download ")
  let data ;
  let fileObj;
  let brandName='';
  // this.utilitiesService.exportFile(data)
  if(!this.isLocationWiseChecked){
    // data=this.fetchData;
   
    let id=this.locationFormGroup.value.brand;
    data=brandColumnObject[id];
    console.log(data);

      const brandObj=this.brands.find((obj:any)=> {return obj.brand_id==id});
       brandName=brandObj.brand;
    
   
  }
  else{

  }
  // console.log("fetch data ",this.fetchData);
  
  this.exportService.downloadFormat({data:data,brand_id:this.locationFormGroup.value.brand}).subscribe((response:Blob)=>{
    const url = window.URL.createObjectURL(response);
    const a = document.createElement('a');
    a.href = url;
    a.download = brandName+' Format.xlsx';
    // a.download = 'multi_sheets'; // Set the name of the downloaded file
    a.click();
    window.URL.revokeObjectURL(url);
    this.isLoading=false;
  });
}
 uploadData(data:any,fileTypeObj:any){
    this.isLoading=true;
   
     this.uploadService.uploadData(data).subscribe({
       next:(res)=>{
        //  console.log("res",res.data.insertResponse)
           this.isLoading=true;
            if(!this.isLocationWiseChecked){
             const brandObj=this.brands.find((obj:any)=>{
               return obj.brand_id==this.locationFormGroup.value.brand;
             })
             this.brand=brandObj.brand; 
             console.log(this.locationFormGroup.value)
             if(this.updatedAuditLogs.length!=0){
              //  console.log("excuted")
               this.updatedAuditLogs=[];
             }
             this.updatedAuditLogs=[];
             if(res.data==true){
              this.isLoading=false;
              this.messageService.add({ severity: 'error', summary:`Part No ,Dealer and Location cannot be blank for ${fileTypeObj.fileType}`, life: 100000 });
             }
             if(res.data.insertResponse==true){
              this.formData = new FormData();
                 this.showTable=false;
                 this.messageService.add({ severity: 'error', summary:`Part No ,Dealer and Location cannot be blank for ${fileTypeObj.fileType}`, life: 100000 });
                 this.isLoading=false;
                 let anotherFileObj=this.fileTypes.find((obj:any)=>{
                  return obj.id!=fileTypeObj.fileTypeId
                 })
                //  console.log("another file type ",anotherFileObj)
                 this.uploadService.deleteUploadedData({brand_id:this.locationFormGroup.value.brand,userId:this.userId,fileTypeId:anotherFileObj.id,insertedId:res.data.insertedId}).subscribe((res:any)=>{
                  this.uploadService.uploadLogs({brand:this.locationFormGroup.value.brand,fileType:data.fileType,userId:this.userId}).subscribe({
                    next:(res: any) => {
                     
                      this.isScreenCollapsed=true
                      this.isSearchButton=true;
                      this.uploadLogs = res.data;
                      this.updatedAuditLogs=[];
                     
                      this.uploadLogs.forEach((item: any) => {
                        // this.updatedDate = this.datePipe.transform(item.dateTime, 'yyyy-MM-dd')!;
                       //  console.log("updated ", this.updatedDate);
                       let date = item.dateTime.split("T")[0];  // Extracts "2025-01-10"
                       let time = item.dateTime.split("T")[1].split("Z")[0];
                       let [hours, minutes] = time.split(":");  // Extracts "13" and "22"

                       // Step 3: Format the time as "hh:mm"
                       let formattedTime = `${hours}:${minutes}`;
                       this.updatedDate=date+" "+formattedTime
                        let user = this.users.find((obj: any) => { return obj.userId == item.userID; });
                        this.updatedBy = user.name;
                        console.log(this.fileTypes)
                        fileTypeObj=this.fileTypes.find((obj:any)=>{
                          // console.log("id ",obj.id,this.locationFormGroup.value.fileType)
                       return obj.id==item.fileTypeID;
                      })
                      console.log("fileTypeObj in 573 line",fileTypeObj)
                        this.updatedAuditLogs.push({
                          ...item,
                          updatedDate: this.updatedDate,
                          updatedBy: this.updatedBy,
                          fileType:fileTypeObj.fileType
                          // Keep the original log data too, if needed
                        });
                        this.showTable=true;
                        this.isSearchButton = true;
                       //  if(this.uploadLogs.length==0){
                       //   this.showTable=false;
       
                       //  }
                       //  else{
                       //    this.showTable=true;
       
                       //  }
                       this.isLoading=false;
                        this.formData = new FormData();
                        // this.uploadedFiles=[];
                        return this.updatedLogs
                      });
                     
                      // this.locationFormGroup.reset()
                    },
                    error:(error:any)=>{
                    
                    this.isLoading=false;
                      // this.uploadedFiles=[];
                      this.formData = new FormData();
                    }
                  })
                })
                 // this.showTable=false;
             }
             if(res.data.insertResponse==false){
              console.log("excuting insrt response =false")
               this.uploadService.uploadLogs({brand:this.locationFormGroup.value.brand,fileType:data.fileType,userId:this.userId}).subscribe({
                next:(res1: any) => {
                 this.isLoading=true;
                  this.isScreenCollapsed=true
                  this.isSearchButton=true;
                  this.uploadLogs = res1.data;
                  this.updatedAuditLogs=[];
                  this.uploadLogs.forEach((item: any) => {
                    // this.updatedDate = this.datePipe.transform(item.dateTime, 'yyyy-MM-dd')!;
                   //  console.log("updated ", this.updatedDate);
                   let date = item.dateTime.split("T")[0];  // Extracts "2025-01-10"
                   let time = item.dateTime.split("T")[1].split("Z")[0];
                   let [hours, minutes] = time.split(":");  // Extracts "13" and "22"

                   // Step 3: Format the time as "hh:mm"
                   let formattedTime = `${hours}:${minutes}`;
                   this.updatedDate=date+" "+formattedTime
                    let user = this.users.find((obj: any) => { return obj.userId == item.userID; });
                    this.updatedBy = user.name;
                    fileTypeObj=this.fileTypes.find((obj:any)=>{

                      // console.log("id ",obj.id,this.locationFormGroup.value.fileType)
                   return obj.id==item.fileTypeID;
                  })
                  // console.log("fileTypeObj in 573 line",fileTypeObj)
                    this.updatedAuditLogs.push({
                      ...item,
                      updatedDate: this.updatedDate,
                      updatedBy: this.updatedBy,
                      fileType:fileTypeObj.fileType
                      // Keep the original log data too, if needed
                    });
                    this.showTable=true;
                    this.isSearchButton = true;
                   //  if(this.uploadLogs.length==0){
                   //   this.showTable=false;
   
                   //  }
                   //  else{
                   //    this.showTable=true;
   
                   //  }
                   this.isLoading=false;
                    this.formData = new FormData();
                    // this.uploadedFiles=[];
                    return this.updatedLogs
                  });
                 
                  // this.locationFormGroup.reset()
                },
                error:(error:any)=>{
                
                this.isLoading=false;
                  // this.uploadedFiles=[];
                  this.formData = new FormData();
                }
              })

             }       
            }
            else{
                      const brandObj=this.brands.find((obj:any)=>{
                         return obj.brand_id==this.uploadForm.value.brand;
                       })
                       this.brand=brandObj.brand;
                 
                       const dealerObj=this.dealers.find((obj:any)=>{
                         return obj.dealer_id==this.uploadForm.value.dealer;
                       })
                       this.dealer=dealerObj.dealer_name;
                 
                       const locationObj=this.locations.find((obj:any)=>{
                         return obj.Location_id==this.uploadForm.value.location;
                       })
                       this.location=locationObj.Location_name
                       if(this.updatedAuditLogs.length!=0){
                         // console.log("excuted")
                         this.updatedAuditLogs=[];
                       }
                       if(res.data==true){
                        this.isLoading=false;
                        this.messageService.add({ severity: 'error', summary:`Part No cannot be blank for ${fileTypeObj.fileType}`, life: 100000 });
                       }
                       if(res.data.insertResponse==true){
                        this.formData = new FormData();
                           this.showTable=false;
                           if(this.isLocationWiseChecked){
                            let userId=localStorage.getItem('userId');
                            let anotherFileObj=this.fileTypes.find((obj:any)=>{
                              return obj.id!=fileTypeObj.fileTypeId
                             })
                            // console.log("file obj in upload form while delete",fileTypeObj)
                             this.uploadService.deleteUploadedData({brand_id:this.uploadForm.value.brand,userId:userId,fileTypeId:anotherFileObj.id,insertedId:res.data.insertedId}).subscribe((res:any)=>{
                              this.uploadService.uploadLogs({brand:this.uploadForm.value.brand,dealer:this.uploadForm.value.dealer,location:this.uploadForm.value.location,fileType:data.fileType,userId:this.userId}).subscribe({
                                next:(res:any)=>{
                                
                                
                                 this.isScreenCollapsed=true
                                 this.isSearchButton=true;
                                  this.uploadLogs=res.data;
                                  this.updatedAuditLogs=[];
                                  this.uploadLogs.forEach((item:any)=>{
                                    const dateObj = item.dateTime
                                    let fileTypeObj1=this.fileTypes.find((obj:any)=>{
                                      // console.log("id ",obj.id,this.locationFormGroup.value.fileType)
                                   return obj.id==item.fileTypeID;
                                  })
                                    // this.updatedDate = this.datePipe.transform(item.dateTime, 'yyyy-MM-dd')!;
                                    // console.log("updated ",this.updatedDate)
                                    let date = item.dateTime.split("T")[0];  // Extracts "2025-01-10"
                                    let time = item.dateTime.split("T")[1].split("Z")[0];
                                    let [hours, minutes] = time.split(":");  // Extracts "13" and "22"
      
                                    // Step 3: Format the time as "hh:mm"
                                    let formattedTime = `${hours}:${minutes}`;
                                    this.updatedDate=date+" "+formattedTime
                                    let user=this.users.find((obj:any)=>{return obj.userId==item.userID})
                                    this.updatedBy=user.name;
                                    this.updatedAuditLogs.push({
                                      ...item ,
                                      updatedDate: this.updatedDate,
                                      updatedBy: this.updatedBy,
                                      fileType:fileTypeObj1.fileType
                                      // Keep the original log data too, if needed
                                  });
                                  })
                                
                                 //  this.uploadForm.reset();
                                 this.isLoading=false;
                                 this.showTable=true;
                                  this.formData = new FormData();
                                  // this.uploadedFiles=[];
                                  return this.updatedLogs;
                                },
                               error:(erro:any)=>{
                                 this.isLoading=false;
                               }})
                             });
                           }
                           else{
                            let anotherFileObj=this.fileTypes.find((obj:any)=>{
                              return obj.id!=fileTypeObj.fileTypeId
                             })
                            this.uploadService.deleteUploadedData({brand_id:this.uploadForm.value.brand, dealer:this.uploadForm.value.dealer,location:this.uploadForm.value.location,userId:this.userId,fileTypeId:anotherFileObj.id,insertedId:res.data.insertedId}).subscribe((res:any)=>{
                              this.uploadService.uploadLogs({brand:this.uploadForm.value.brand,dealer:this.uploadForm.value.dealer,location:this.uploadForm.value.location,fileType:data.fileType,userId:this.userId}).subscribe({
                                next:(res:any)=>{
                                
                                
                                 this.isScreenCollapsed=true
                                 this.isSearchButton=true;
                                  this.uploadLogs=res.data;
                                  this.updatedAuditLogs=[];
                                  this.uploadLogs.forEach((item:any)=>{
                                    const dateObj = item.dateTime
                          
                                    // this.updatedDate = this.datePipe.transform(item.dateTime, 'yyyy-MM-dd')!;
                                    // console.log("updated ",this.updatedDate)
                                    let date = item.dateTime.split("T")[0];  // Extracts "2025-01-10"
                                    let time = item.dateTime.split("T")[1].split("Z")[0];
                                    let [hours, minutes] = time.split(":");  // Extracts "13" and "22"
      
                                    // Step 3: Format the time as "hh:mm"
                                    let formattedTime = `${hours}:${minutes}`;
                                    this.updatedDate=date+" "+formattedTime
                                    let fileTypeObj1=this.fileTypes.find((obj:any)=>{
                                      // console.log("id ",obj.id,this.locationFormGroup.value.fileType)
                                   return obj.id==item.fileTypeID;
                                  })
                                    let user=this.users.find((obj:any)=>{return obj.userId==item.userID})
                                    this.updatedBy=user.name;
                                    this.updatedAuditLogs.push({
                                      ...item ,
                                      updatedDate: this.updatedDate,
                                      updatedBy: this.updatedBy,
                                      fileType:fileTypeObj1.fileType
                                      // Keep the original log data too, if needed
                                  });
                                  })
                                
                                 //  this.uploadForm.reset();
                                 this.isLoading=false;
                                 this.showTable=true;
                                  this.formData = new FormData();
                                  // this.uploadedFiles=[];
                                  return this.updatedLogs;
                                },
                               error:(erro:any)=>{
                                 this.isLoading=false;
                               }})
                            });
                           }
                           this.messageService.add({ severity: 'error', summary:`Part No cannot be blank for ${fileTypeObj.fileType}`, life: 100000 });
                           this.isLoading=false;
                           
                           // this.showTable=false;
                       }
                       if(res.data.insertResponse==false)
                       {
                        let anotherFileObj=this.fileTypes.find((obj:any)=>{
                          return obj.id!=fileTypeObj.fileTypeId
                         })
                        // this.uploadService.deleteUploadedData({brand_id:this.uploadForm.value.brand,userId:this.userId,fileTypeId:anotherFileObj.id,insertedId:res.data.insertedId}).subscribe((res:any)=>{
                          
                        // })
                        this.uploadService.uploadLogs({brand:this.uploadForm.value.brand,dealer:this.uploadForm.value.dealer,location:this.uploadForm.value.location,fileType:data.fileType,userId:this.userId}).subscribe({
                          next:(res:any)=>{
                          
                          
                           this.isScreenCollapsed=true
                           this.isSearchButton=true;
                            this.uploadLogs=res.data;
                            this.updatedAuditLogs=[];
                            this.uploadLogs.forEach((item:any)=>{
                              const dateObj = item.dateTime
                    
                              // this.updatedDate = this.datePipe.transform(item.dateTime, 'yyyy-MM-dd')!;
                              let date = item.dateTime.split("T")[0];  // Extracts "2025-01-10"
                              let time = item.dateTime.split("T")[1].split("Z")[0];
                              let [hours, minutes] = time.split(":");  // Extracts "13" and "22"

                              // Step 3: Format the time as "hh:mm"
                              let formattedTime = `${hours}:${minutes}`;
                              this.updatedDate=date+" "+formattedTime
                              console.log("updated ",this.updatedDate)
                              let user=this.users.find((obj:any)=>{return obj.userId==item.userID})
                              fileTypeObj=this.fileTypes.find((obj:any)=>{
                                // console.log("id ",obj.id,this.locationFormGroup.value.fileType)
                             return obj.id==item.fileTypeID;
                            })
                              this.updatedBy=user.name;
                              this.updatedAuditLogs.push({
                                ...item ,
                                updatedDate: this.updatedDate,
                                updatedBy: this.updatedBy,
                                fileType:fileTypeObj.fileType
                                // Keep the original log data too, if needed
                            });
                            })
                          
                           //  this.uploadForm.reset();
                           this.isLoading=false;
                           this.showTable=true;
                            this.formData = new FormData();
                            // this.uploadedFiles=[];
                            return this.updatedLogs;
                          },
                         error:(erro:any)=>{
                           this.isLoading=false;
                         }})

                       }
                        //  this.uploadedFiles=[];
                         this.formData = new FormData();
                        }
         
          //  if(res?.allColumnsPresent==false){
          //    this.messageService.add({ severity: 'warn', summary:'Your uploaded does not contains with the mapped data', life: 100000 }); 
          //  }
          //  if(res?.fileMissMatch){
          //    this.messageService.add({ severity: 'warn', summary:'Warning !!!', detail:'Your columns are not present according to the mapped data', life: 10000 });
          //  }
           if(res.status==201)
           {
             this.isLoading=false;
           }
           // if(res.status=400){
           //   this.messageService.add({severity:'error', summary:'Warning !!',detail:'Part Number, Dealer and Location cannot be null Bad request',life:20000})
           // }
       },error:(error)=>{
         console.log(error)
         this.isLoading=false;
         if(!this.isLocationWiseChecked){
          let anotherFileObj=this.fileTypes.find((obj:any)=>{
            return obj.id!=fileTypeObj.fileTypeId
           })
          //  this.uploadService.deleteUploadedData({brand_id:this.locationFormGroup.value.brand,fileTypeId:anotherFileObj.id}).subscribe((res:any)=>{})
         }
         // this.isLoading = false;
         // console.error("Error occurred during upload:", );
        //  this.messageService.add({
        //    severity: 'error',
        //    summary: 'Error !!',
        //    detail: error.error.message,
        //    life: 20000
        //  });
         return;
       }
     })

    
   
  }

downloadExcelFile(data?:any){
  const sheet1:XLSX.WorkSheet = XLSX.utils.json_to_sheet(data[0]);
  const sheet2:XLSX.WorkSheet = XLSX.utils.json_to_sheet(data[1]);
  const sheet3:XLSX.WorkSheet = XLSX.utils.json_to_sheet(data[2]);
  // const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheet1, 'Dealer & Location');
  XLSX.utils.book_append_sheet(wb, sheet2, 'Part not in Master');
  XLSX.utils.book_append_sheet(wb, sheet3, 'Rows Deleted');
  XLSX.writeFile(wb, 'logs_file.xlsx');
}

getFileType(brandId:any){
  this.utilitiesService.getFileType(brandId).subscribe((res:any)=>{
    this.fileTypes=res.data
  })
}

getUsers(){
  this.userService.getUsers().subscribe((data:any)=>{
    this.users=data.data
  })
}

collapseScreen(){
  this.isScreenCollapsed=!this.isScreenCollapsed
}
}
