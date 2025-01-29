import { Component } from '@angular/core';
import { PrimengModule } from '../../shared/primeng/primeng.module';
import { HeaderComponent } from "../../core/header/header.component";
import { SidebarComponent } from "../../core/sidebar/sidebar.component";
import { RoleBasedService } from '../../services/role-based.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { atLeastOneCheckedValidator } from '../../shared/validators/atLeastOnCheckedValidator';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-create-role',
  standalone: true,
  imports: [PrimengModule, HeaderComponent, SidebarComponent,FormsModule,ReactiveFormsModule,CommonModule,],
  providers:[MessageService],
  templateUrl: './create-role.component.html',
  styleUrl: './create-role.component.css'
})
export class CreateRoleComponent {
  isLoading:boolean=false;
  customers = [
    {
      name: 'John Doe',
      industry: 'Technology',
      segment: 'Retail',
      status: 'Active',
      contactNo: '1234567890',
      address: '1234 Elm Street',
    },
    {
      name: 'Jane Smith',
      industry: 'Finance',
      segment: 'Wholesale',
      status: 'Inactive',
      contactNo: '9876543210',
      address: '5678 Oak Avenue',
    },
    {
      name: 'John Doe',
      industry: 'Technology',
      segment: 'Retail',
      status: 'Active',
      contactNo: '1234567890',
      address: '1234 Elm Street',
    },
    {
      name: 'Jane Smith',
      industry: 'Finance',
      segment: 'Wholesale',
      status: 'Inactive',
      contactNo: '9876543210',
      address: '5678 Oak Avenue',
    },
    {
      name: 'John Doe',
      industry: 'Technology',
      segment: 'Retail',
      status: 'Active',
      contactNo: '1234567890',
      address: '1234 Elm Street',
    },
    {
      name: 'Jane Smith',
      industry: 'Finance',
      segment: 'Wholesale',
      status: 'Inactive',
      contactNo: '9876543210',
      address: '5678 Oak Avenue',
    },
    {
      name: 'John Doe',
      industry: 'Technology',
      segment: 'Retail',
      status: 'Active',
      contactNo: '1234567890',
      address: '1234 Elm Street',
    },
    {
      name: 'Jane Smith',
      industry: 'Finance',
      segment: 'Wholesale',
      status: 'Inactive',
      contactNo: '9876543210',
      address: '5678 Oak Avenue',
    },
    {
      name: 'John Doe',
      industry: 'Technology',
      segment: 'Retail',
      status: 'Active',
      contactNo: '1234567890',
      address: '1234 Elm Street',
    },
    {
      name: 'Jane Smith',
      industry: 'Finance',
      segment: 'Wholesale',
      status: 'Inactive',
      contactNo: '9876543210',
      address: '5678 Oak Avenue',
    },
    {
      name: 'John Doe',
      industry: 'Technology',
      segment: 'Retail',
      status: 'Active',
      contactNo: '1234567890',
      address: '1234 Elm Street',
    },
    {
      name: 'Jane Smith',
      industry: 'Finance',
      segment: 'Wholesale',
      status: 'Inactive',
      contactNo: '9876543210',
      address: '5678 Oak Avenue',
    },
    {
      name: 'John Doe',
      industry: 'Technology',
      segment: 'Retail',
      status: 'Active',
      contactNo: '1234567890',
      address: '1234 Elm Street',
    },
    {
      name: 'Jane Smith',
      industry: 'Finance',
      segment: 'Wholesale',
      status: 'Inactive',
      contactNo: '9876543210',
      address: '5678 Oak Avenue',
    }
  ];
  userId:any;
  roleForm:FormGroup
  constructor(private roleService:RoleBasedService,
    private fb:FormBuilder,private messageService:MessageService
  ){
    this.roleForm = this.fb.group({
      rolename: ['', Validators.required],
      SIMS: [0], // default is 0 (unchecked)
      AUDIT: [0],
      GAINER: [0],
      IT: [0],
      HR: [0],
      OTHERS: [0]
    }, { validators: atLeastOneCheckedValidator() });
  
    this.userId=localStorage.getItem('userId');
  }

  get rolename() {
    return this.roleForm.get('rolename');
  }
  submit(){
    if(this.roleForm.valid){

      let formValues = this.roleForm.value;
      // console.log("form value ",this.roleForm.value)
      for (let key in formValues) {
        if (formValues[key] === true) {
          formValues[key] = 1;  // If checkbox is checked, set it to an array with '1'
        } else if (formValues[key] === false) {
          formValues[key] = 0;  // If checkbox is unchecked, set it to 0
        }
      }
  
      this.isLoading=true;
      // console.log(formValues);
      this.roleService.createRole({...formValues,userId:this.userId}).subscribe((res:any)=>{
        this.isLoading=false;
        this.roleForm.reset();
        this.messageService.add({severity:'success' ,summary:'Role has created Successfully',life:30000000})
      },(error:any)=>{
        this.isLoading=false;
        this.roleForm.reset();
        this.messageService.add({severity:'error',detail:'There is some error in creating role..',life:3000000000});
      })
    }
    else{
      
      Object.keys(this.roleForm.value).forEach(controlName=>{
        this.roleForm?.get(controlName)?.markAsTouched();
      })
    }
  }
}
