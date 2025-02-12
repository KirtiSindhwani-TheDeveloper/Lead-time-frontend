import { ChangeDetectorRef, Component } from '@angular/core';
import { PrimengModule } from '../../shared/primeng/primeng.module';
import { SharedModule } from '../../shared/shared.module';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../core/sidebar/sidebar.component';
import { Router } from '@angular/router';
import { UtilitiesService } from '../../services/utilities.service';
import { HeaderComponent } from "../../core/header/header.component";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UserManagementModule } from '../user-management.module';
import { UserService } from '../../services/user.service';
import { MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-view-user',
  imports: [PrimengModule, MatSlideToggleModule, SharedModule, FormsModule, ReactiveFormsModule, CommonModule, SidebarComponent, HeaderComponent],
  providers:[MessageService],
  templateUrl: './view-user.component.html',
  styleUrl: './view-user.component.css'
})
export class ViewUserComponent {
  users:any = [
]
    visible: boolean = false;
    associatedBusinesses:any=[
  ];
  designationName:any;
  roleName:any;
  businessVertical:any;
  isLoading:boolean=false;
    roles:any=[];
    designations:any=[];
    actionName:any;
  editUserForm:FormGroup;
  rowId:any;
  token:any;
  userId:any;
    statuses:any=[
      { name:'Active',id:1},
   
       {name:'Inactive',id:0}
     ]
    constructor(private router:Router,private utilitiesService:UtilitiesService,
      private fb:FormBuilder,private cdr:ChangeDetectorRef,
      private userService:UserService,private messageService:MessageService
  
    ){
     
 this.editUserForm= this.fb.group({
    // Define each form control with validators combined using Validator.compose
    name: ['', Validators.compose([Validators.required])],
    designation: ['', Validators.required],
    role: ['', Validators.required],
    email: ['', Validators.compose([Validators.required, Validators.email])],
    mobileNo: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]{10}$')])],
    associatedBusiness: ['', Validators.required],
    status: ['', Validators.required]
  });
}
  

  showDialog(action:any,rowData?:any) {
 //  console.log(rowData)
    this.actionName=action;
    if(this.actionName=='Add User'){
      this.editUserForm.reset();
    }else{
      this.rowId=rowData.userId;
      let designationObj=this.designations.find((obj:any)=>{ return obj.id==rowData.designationId})
      let roleObj=this.roles.find((obj:any)=>{return obj.id==rowData.roleId})
      let verticalObj=this.associatedBusinesses.find((obj:any)=>{return obj.id==rowData.business_vertical})
      let statusObj=this.statuses.find((obj:any)=>{return obj.name==rowData.status})
      //console.log(roleObj,designationObj,verticalObj,statusObj)
      this.editUserForm.patchValue({
        name: rowData.name,
        email: rowData.emailId,
        designation: designationObj ? designationObj.id : null,  // Patch the ID, not the name
        role: roleObj ? roleObj.id : null,  // Patch the ID, not the name
        associatedBusiness: verticalObj ? verticalObj.id : null,  // Patch the ID, not the name
        mobileNo: rowData.mobileNo,
        userId: rowData.userId,
        status: statusObj?statusObj?.name:null
      });
    }
    this.visible = true;
    // console.log(rowData)

   

    // console.log("edituser form ",this.editUserForm.value)
}
    addUser(){
      this.router.navigate(['/create-user'])
    }

     ngOnInit(){
    
      this.getRoles();
  
    this.userId=localStorage.getItem('userId');
    this.token=localStorage.getItem('authToken')
    }

    getToggleStatus(product: any): boolean {
      return product.status === 'Active';
    }
  
    setToggleStatus(product: any, value: boolean): void {
      product.status = value ? 'Active' : 'Inactive';
    }
    setToggleState(product: any): boolean {
      return product.status === 'Active'; // true if 'Active', false if 'Inactive'
    }
  
    onStatusChange(product: any,status:any) {
      // this.setToggleStatus(product, this.getToggleStatus(product));
      //let status=product.status === 'Active' ? 'Inactive' : 'Active'
      // This ensures that the status is updated correctly when toggling
      product.status = product.status === 'Active' ? 'Inactive' : 'Active';

      console.log(product);
      this.isLoading=true;
      this.userService.deleteUser({...product,token:this.token,loginUserId:this.userId}).subscribe((res:any)=>{
        this.isLoading=false;
        this.viewUser();
      },(error:any)=>{
        this.isLoading=false;
      })
  }
    getRoles(){
      this.isLoading=true;
      this.utilitiesService.getRoles().subscribe((res:any)=>{
        // this.isLoading=false;
        this.roles=res.data;
        this.getDesignations();
      },(error:any)=>{
        this.isLoading=false;
        console.log("roles error ",error)
      })
    }
  
    getDesignations(){
      this.isLoading=true;
      this.utilitiesService.getDesignations().subscribe((res:any)=>{
        // this.isLoading=false;;
        this.designations=res.data;
        this.getBusinessVertical();
      },(error:any)=>{
        this.isLoading=false;
        console.log("designtion error ",error)
      })
    }

    getBusinessVertical(){
      this.isLoading=true;
      this.utilitiesService.getBusinessVertical().subscribe((res:any)=>{
        // this.isLoading=false;
        this.associatedBusinesses=res.data;
        this.viewUser();
      },(error:any)=>{
        this.isLoading=false
        console.log("vertical error ",error)
      })
    }

    cancel(){
      this.markFormControlsAsUntouched();
      this.visible=false
       this.editUserForm.reset();  // Resets form values to their initial state
      

    // Step 2: Trigger change detection to apply changes
    this.cdr.detectChanges();

      
      // this.editUserForm.markAsUntouched(); // Marks all controls as untouched
      // this.editUserForm.markAsPristine(); // Marks all controls as pristine
  
    }
     

    exportToExcel(): void {

      let data:any=[];
      this.users.forEach((item:any)=>{
        data.push({
          Name:item.name,
        Role:item.roleName,
        Designation:item.designationName,
        'Email Id':item.emailId,
        'Mobile No':item.mobileNo,
        'Business Vertical':item.associatedBusiness
        })
        
      })
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data); // Convert JSON data to worksheet
      const wb: XLSX.WorkBook = XLSX.utils.book_new(); // Create a new workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1'); // Append worksheet to workbook
  
      // Export the workbook to a file
      XLSX.writeFile(wb, 'Users List.xlsx');
    }
    private markFormControlsAsUntouched() {
      Object.keys(this.editUserForm.controls).forEach(controlName => {
        const control = this.editUserForm.get(controlName);
        if (control) {
          control.markAsUntouched();
          control.markAsPristine();
        }
      });
    }
  
    viewUser(){
       this.isLoading=true;
      this.userService.viewUser().subscribe((res:any)=>{
         this.isLoading=false;
         let userArray=[];
        for(let item of res.data){
          //console.log(this.roles,this.associatedBusinesses,this.designations)
          let designationObj=this.designations.find((obj:any)=> {return item.designationId==obj.id})
         // console.log("designation ", item.designationId ,designationObj);
          this.designationName=designationObj?.designation_name

          let businessVerticalObj=this.associatedBusinesses.find((obj:any)=>  { return item.business_vertical==obj.id})
          // console.log("designation ",businessVerticalObj);
          this.businessVertical=businessVerticalObj?.business_vertical

          let roleObj=this.roles.find((obj:any)=>  {return item.roleId==obj.id})
          //console.log("designation ",roleObj);
          this.roleName=roleObj?.role_name

          userArray.push({
            ...item,
            designationName:designationObj?.designation_name,
            roleName:roleObj?.role_name,
            associatedBusiness:businessVerticalObj?.business_vertical
          
        })
        
      }
      this.users=userArray;
     // console.log("users ",this.users)
       
      },(error:any)=>{
        this.isLoading=false;
      })
    }

    submit(){

      if(this.editUserForm.valid){
        console.log(this.editUserForm.value)
      //  let link="http://localhost:4200/update-user-password";
      let link="http://103.30.72.109/update-user-password";
        if(this.actionName=='Add User'){
          this.isLoading=true;
          this.userService.createUser({...this.editUserForm.value,userId:this.userId,token:this.token,link:link}).subscribe((res:any)=>{
            this.isLoading=false;
            this.messageService.add({severity:'success',life:10000,summary:'User is created Succesfully',detail:'Email has been sent to your registered ID'})
            
            this.viewUser();
            this.visible = false;
          },(error:any)=>{
            this.isLoading=false;
            this.messageService.add({severity:'error',life:30000000,summary:'Error in creating User...'})
          })
        }
        else{
          this.isLoading=true;
          this.userService.editUser({...this.editUserForm.value,userId:this.rowId,updatedBy:this.userId,token:this.token}).subscribe((res:any)=>{
            this.isLoading=false;
            this.messageService.add({severity:'success',life:10000,summary:'User is updated Succesfully.'})
            console.log(this.roles,this.designations)
            this.viewUser();
            this.visible=false;
          },(error:any)=>{
            this.isLoading=false;
            this.messageService.add({severity:'error',life:30000000,summary:'Error in updating User...'})
          })
        }
       
      }
      else{
        Object.keys(this.editUserForm.controls).forEach(controlName=>{
          this.editUserForm.get(controlName)?.markAsTouched()
        })
      }
    }

}
