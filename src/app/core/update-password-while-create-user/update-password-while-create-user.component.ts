import { Component } from '@angular/core';
import { PrimengModule } from '../../shared/primeng/primeng.module';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import {CommonModule} from '@angular/common';
@Component({
  selector: 'app-update-password-while-create-user',
  standalone: true,
  imports: [PrimengModule,FormsModule,CommonModule],
  providers:[MessageService],
  templateUrl: './update-password-while-create-user.component.html',
  styleUrl: './update-password-while-create-user.component.css'
})
export class UpdatePasswordWhileCreateUserComponent {

  email:any;
  password:any;
  isLoading:boolean=false;
  qrCodeUrl:any;

  OTP:any;
  secretKey:any
  constructor(private authService:AuthService,private messageService:MessageService,private router:Router){

  }

  verifyOTP(){
    this.isLoading=true;
    this.authService.twoFactorAuthentication({token:this.OTP,secret:this.secretKey}).subscribe( (response) => {
      // this.messageService.add({severity:'success',life:300000,summary:'Invalid OTP',detail:'Try Again!!'})
       this.isLoading=false;
      
      
            this.router.navigate(['/dashboard']);
            this.OTP=''
      // alert('2FA verified successfully!');
    },
    (error) => {
      this.isLoading=false;
      this.OTP=''
      this.messageService.add({severity:'error',life:300000,summary:'Invalid OTP',detail:'Try re-scanning QR Code Again!!'})
      // alert('Invalid OTP');
    })
  }
  googleAuth(){
    
    this.isLoading=true;
    this.authService.generateQR().subscribe((res:any)=>{
      this.qrCodeUrl=res.qr;
      this.secretKey=res.secret;
      this.isLoading=false;
    },(error:any)=>{
      this.messageService.add({severity:'error',life:100000,summary:'Error in processing for Google Authenticator'})
    })
  }
}
