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
  token:any;
  userId:any;
    statuses:any=[
      { name:'Active',id:1},
   
       {name:'InActive',id:0}
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
    password: ['', Validators.required],
    status: ['', Validators.required]
  });
}
  

  showDialog(action:any,rowData?:any) {

    this.actionName=action;
    if(this.actionName=='Add User'){
      this.editUserForm.reset();
    }else{
      this.editUserForm.patchValue({
        name: rowData.name,
        email: rowData.email,
        designation:rowData.designation,
        mobileNo:rowData.mobile,
        userId:rowData.userId,
        password:rowData.password,
        status:rowData.status
      });
    }
    this.visible = true;
    // console.log(rowData)

   

    // console.log("edituser form ",this.editUserForm.value)
}
    addUser(){
      this.router.navigate(['/create-user'])
    }

    async ngOnInit(){
     this.getRoles();
   this.getDesignations();
   this.getBusinessVertical();
  await  this.viewUser();
    this.userId=localStorage.getItem('userId');
    this.token=localStorage.getItem('authToken')
    }
    getRoles(){
      this.utilitiesService.getRoles().subscribe((res:any)=>{
        this.roles=res.data;
      })
    }
  
    getDesignations(){
      this.utilitiesService.getDesignations().subscribe((res:any)=>{
        this.designations=res.data;
      })
    }
    getBusinessVertical(){
      this.utilitiesService.getBusinessVertical().subscribe((res:any)=>{
        this.associatedBusinesses=res.data;
      })
    }
    cancel(){
       this.editUserForm.reset();  // Resets form values to their initial state
      
      this.markFormControlsAsUntouched();

    // Step 2: Trigger change detection to apply changes
    this.cdr.detectChanges();

      this.visible=false
      // this.editUserForm.markAsUntouched(); // Marks all controls as untouched
      // this.editUserForm.markAsPristine(); // Marks all controls as pristine
  
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

          this.users.push({
            ...item,
            designationName:designationObj?.designation_name,
            roleName:roleObj?.role_name,
            associatedBusiness:businessVerticalObj?.business_vertical
          
        })
        
      }
      console.log("users ",this.users)
       
      },(error:any)=>{
        this.isLoading=false;
      })
    }
    submit(){
      if(this.editUserForm.valid){
        console.log(this.editUserForm.value)
       
        if(this.actionName=='Add User'){
          this.isLoading=true;
          this.userService.createUser({...this.editUserForm.value,userId:this.userId,token:this.token}).subscribe((res:any)=>{
            this.isLoading=false;
            
            this.messageService.add({severity:'success',life:300000,summary:'User is Created Succesfully'})
            this.visible = false;
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
