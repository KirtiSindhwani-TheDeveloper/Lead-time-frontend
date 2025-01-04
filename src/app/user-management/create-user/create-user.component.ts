import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from '../../shared/primeng/primeng.module';
import { SharedModule } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../core/sidebar/sidebar.component';

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

  addUserForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    designation: new FormControl(''),
    role: new FormControl(''),
    email: new FormControl(''),
    mobileNo: new FormControl(''),
    userId: new FormControl(''),
    password: new FormControl(''),
    status: new FormControl('')
  })
}
