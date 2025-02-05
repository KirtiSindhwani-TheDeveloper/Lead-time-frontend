import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PrimengModule } from '../../shared/primeng/primeng.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-header',
  imports: [PrimengModule,ReactiveFormsModule,FormsModule,CommonModule],
  providers:[MessageService],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  items: any;
  updatePassForm:FormGroup;
  showDialog:boolean=false;
  constructor(private authService: AuthService,private fb:FormBuilder,private messageService:MessageService) {
    this.updatePassForm=this.fb.group({
      email:['',Validators.required,Validators.email]
    })
   }

  ngOnInit() {
      this.items = [
          
          {
              label: 'Log Out',
              icon: 'pi pi-sign-out',
              command: () => this.onLogout()
          },
          {
              separator: true
          },
          {
            label: 'Update Password',
            icon: 'bx bxs-edit',
            command: () => this.updatePassword()
        },
          
        ]
      }

      onSubmit(){

        this.messageService.add({severity:'success',life:300000,summary:'Email has been sent to your registred ID.'})
        this.messageService.add({severity:'error',life:300000,summary:'Kindly enter valid registered Email.'})
      }  
  onLogout(): void {
    this.authService.logout();  // Call logout from AuthService
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated(); // Check if user is authenticated
  }

  updatePassword(){
    this.showDialog=true;
  }
}
