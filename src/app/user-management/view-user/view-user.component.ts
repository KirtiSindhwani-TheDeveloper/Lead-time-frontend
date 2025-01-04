import { Component } from '@angular/core';
import { PrimengModule } from '../../shared/primeng/primeng.module';
import { SharedModule } from '../../shared/shared.module';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../core/sidebar/sidebar.component';

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

    showDialog() {
        this.visible = true;
    }

    designations:any;
    editUserForm: FormGroup = new FormGroup({
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
