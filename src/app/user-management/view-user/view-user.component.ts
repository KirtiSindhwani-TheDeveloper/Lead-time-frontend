import { Component } from '@angular/core';
import { PrimengModule } from '../../shared/primeng/primeng.module';
import { SharedModule } from '../../shared/shared.module';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../core/sidebar/sidebar.component';
import { Router } from '@angular/router';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'app-view-user',
  imports: [PrimengModule,SharedModule,FormsModule,ReactiveFormsModule,CommonModule,SidebarComponent],
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
    roles:any=[];
    designations:any=[];
   
  editUserForm:FormGroup;
    statuses:any=[
      { name:'Active',id:1},
   
       {name:'InActive',id:0}
     ]
    constructor(private router:Router,private utilitiesService:UtilitiesService,
      private fb:FormBuilder
  
    ){
 this.editUserForm= this.fb.group({
    name: ['', [Validators.required]],
    designation: ['', [Validators.required]],
    role: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]], // Added email validator
    mobileNo: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]], // Optional pattern for phone number validation
    userId: ['', [Validators.required]],
    password: ['', [Validators.required]],
    status: ['', [Validators.required]]
    })
  }

  showDialog(rowData:any) {
    this.visible = true;
    console.log(rowData)
    this.editUserForm.patchValue({
      name: rowData.name,
      email: rowData.email,
      designation:rowData.designation,
      mobileNo:rowData.mobile,
      userId:rowData.userId,
      password:rowData.password,
      status:rowData.status
    });

    console.log("edituser form ",this.editUserForm.value)
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
      this.visible = false;
     
      if (this.editUserForm) {
        this.editUserForm.reset();  // Reset the form fields
      }
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
