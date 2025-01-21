import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimengModule } from '../../shared/primeng/primeng.module';
import { SharedModule } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../core/sidebar/sidebar.component';
import { UtilitiesService } from '../../services/utilities.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-user',
  imports: [PrimengModule,SharedModule,ReactiveFormsModule,FormsModule,CommonModule,SidebarComponent],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent {
  users = [
    {
      name: 'Ayush',
      designation: 'Software Engineer',
      role: 'Frontend',
      email: 'developer@gmail.com',
      mobileNumber: '383829293',
      userId: '232232',
      status: 'Active',
    },
    {
      name: 'Ayush',
      designation: 'Software Engineer',
      role: 'Frontend',
      email: 'developer@gmail.com',
      mobileNumber: '383829293',
      userId: '232232',
      status: 'Active',
    },
    {
      name: 'Ayush',
      designation: 'Software Engineer',
      role: 'Frontend',
      email: 'developer@gmail.com',
      mobileNumber: '383829293',
      userId: '232232',
      status: 'Active',
    },
    {
      name: 'Ayush',
      designation: 'Software Engineer',
      role: 'Frontend',
      email: 'developer@gmail.com',
      mobileNumber: '383829293',
      userId: '232232',
      status: 'Active',
    },
    {
      name: 'Ayush',
      designation: 'Software Engineer',
      role: 'Frontend',
      email: 'developer@gmail.com',
      mobileNumber: '383829293',
      userId: '232232',
      status: 'Active',
    },
    {
      name: 'Ayush',
      designation: 'Software Engineer',
      role: 'Frontend',
      email: 'developer@gmail.com',
      mobileNumber: '383829293',
      userId: '232232',
      status: 'Active',
    },
    {
      name: 'Ayush',
      designation: 'Software Engineer',
      role: 'Frontend',
      email: 'developer@gmail.com',
      mobileNumber: '383829293',
      userId: '232232',
      status: 'Active',
    },

  ];
  designations:any=[]
  roles:any=[]
  statuses:any=[
   { name:'Active',id:1},

    {name:'InActive',id:0}
  ]
  addUserForm: FormGroup ;

  constructor(private utilitiesService:UtilitiesService,private fb:FormBuilder,
  private router:Router
  ){
   this.addUserForm= this.fb.group({
    name: ['', [Validators.required]],
    designation: ['', [Validators.required]],
    role: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]], // Added email validator
    mobileNo: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]], // Optional pattern for phone number validation
    userId: ['', [Validators.required]],
    password: ['', [Validators.required]],
    status: ['', [Validators.required]]
  });
  }

  

  ngOnInit(){

    this.getRoles();
    this.getDesignations();
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

  submit(){
    if(this.addUserForm.valid){

    }
    else{
      Object.keys(this.addUserForm.controls).forEach(controlName => {
              this.addUserForm.get(controlName)?.markAsTouched();
            });
    }
  }

  cancel(){
  this.router.navigate(['/view-user'])
  }
}
