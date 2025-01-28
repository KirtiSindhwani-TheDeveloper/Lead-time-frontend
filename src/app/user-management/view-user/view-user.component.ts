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

@Component({
  selector: 'app-view-user',
  imports: [PrimengModule, MatSlideToggleModule, SharedModule, FormsModule, ReactiveFormsModule, CommonModule, SidebarComponent, HeaderComponent],
  templateUrl: './view-user.component.html',
  styleUrl: './view-user.component.css'
})
export class ViewUserComponent {
  users = [
    {
      name: 'John Doe',
      designation: 'Software Engineer',
      associatedBusiness: 'Tech Solutions',
      email: 'john.doe@example.com',
      mobile: '+1 234 567 890',
      action: 'Edit',
      status: 'Active'
    },]
    visible: boolean = false;
    associatedBusinesses:any=[
      {
      id:1,
      label:'SIMS',
    },
    {
      id:2,
      label:'Audit',
    },
    {
      id:3,
      label:'Gainer',
    },
    {
      id:4,
      label:'IT',
    },
    {
      id:5,
      label:'HR',
    },
    {
      id:6,
      label:'Others',
    }
  ];
    roles:any=[];
    designations:any=[];
    actionName:any;
  editUserForm:FormGroup;
    statuses:any=[
      { name:'Active',id:1},
   
       {name:'InActive',id:0}
     ]
    constructor(private router:Router,private utilitiesService:UtilitiesService,
      private fb:FormBuilder,private cdr:ChangeDetectorRef
  
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
    
    submit(){
      this.editUserForm.reset();
      if(this.editUserForm.valid){
        this.visible = false;
      }
      else{
        Object.keys(this.editUserForm.controls).forEach(controlName=>{
          this.editUserForm.get(controlName)?.markAsTouched()
        })
      }
    }
}
