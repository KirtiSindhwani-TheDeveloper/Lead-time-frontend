import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';
import { PrimengModule } from '../../shared/primeng/primeng.module';
import { MessageService } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,FormsModule,CommonModule,PrimengModule],
  providers:[MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLoading:boolean=false
  visible: boolean = false;
  formSubmitted:boolean = false;
  isPasswordFilledVisible:boolean=false;
  otp:any;
  token:any;
  private modalVisibilitySubscription: any;
  getOtp:boolean=true;
  userLoginInputDetails : FormGroup = new FormGroup({
    email: new FormControl('',[Validators.required]),
    userPassword: new FormControl('',[Validators.required])
  })

  updateInfoForm:FormGroup;
  isPasswordVisible = false;
  constructor(private loginService:LoginService,
    private messageService:MessageService,
    private authService:AuthService,
    private router:Router,
    private fb:FormBuilder,
    private cookieService:CookieService
  ){

    this.updateInfoForm=this.fb.group({
      email: new FormControl('',[Validators.required,Validators.email]),
      password: new FormControl('',[Validators.required]),
      otp:new FormControl('',[Validators.required])
    })
  }

  ngOnInit(){
    // this.modalVisibilitySubscription = this.loginService.modalVisibility$.subscribe(isVisible => {
    //   this.visible = isVisible;
    // });
  }

  shouldShowError(controlName: string) {
    const control = this.updateInfoForm.get(controlName);
    return (control?.touched || this.formSubmitted) && control?.invalid;
  }
 
  onLogin() {
    if(this.userLoginInputDetails.valid){
      let email=this.userLoginInputDetails.value.email;
      let password=this.userLoginInputDetails.value.userPassword
      // console.log(email,password)
      this.isLoading=true;
      this.authService.login({email:email,userPassword:password}).subscribe((res:any)=>{
       
        if(res.user){
          this.cookieService.set('refreshToken',res.refreshToken)
          localStorage.setItem('authToken',res.accessToken)
              
              localStorage.setItem('userId',res.user.userId)
              // localStorage.setItem('authToken', res.data);
              localStorage.setItem('designationId',res.user.designationId)
              localStorage.setItem('roleId',res.user.roleId)
              localStorage.setItem('name',res.user.name)
              localStorage.setItem('status',res.user.status)
              this.router.navigate(['/dashboard']);
              // setTimeout(() => {
               
              // },1000);
             // Navigate to protected route
  
        }
        this.isLoading=false;
      },(error:any)=>{
        this.isLoading=false;
        this.messageService.add({severity:'error',summary:'Invalid Credentials',life:10000})
      })
      
    }
    else{
      Object.keys(this.userLoginInputDetails.controls).forEach(controlName => {
        this.userLoginInputDetails.get(controlName)?.markAsTouched();
      });
    }
     
  }

cancel(){
  this.loginService.closeModal();
  this.visible=false
  this.resetForm();
}
  send(){
    this.getOtp=false
  }
  showDialog() {
    this.updateInfoForm.reset();
    this.resetForm();
    this.visible = true;
    this.isPasswordFilledVisible=false;
    this.getOtp=true;
}
submit(){

if(this.updateInfoForm.get('email')?.valid){
  this.formSubmitted = true;
  if(this.getOtp){
    
    this.loginService.forgotPassword({email:this.updateInfoForm.value.email}).subscribe( {next: (res: any) => {
      if(res.status==200){
         this.getOtp=false;
      }
      // if(res.status==404){
      //   this.messageService.add({ severity: 'error', summary: 'Error', detail: 'This user does not exist', life: 3000 });
      // }
    },
    error: (err: any) => {
      this.getOtp=true
      // This block will execute if an error occurs (e.g., network issue, server error)
      // console.error('Error occurred:', err);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'This user does not exist', life: 3000 });
    }})
  }
  if(!this.isPasswordFilledVisible && !this.getOtp){
    this.loginService.verifyOTP({email:this.updateInfoForm.value.email,otp:this.updateInfoForm.value.otp}).subscribe({
      next: (res: any) => {
        console.log("Response received:", res);
        
        // Check if res and res.status exist before checking status
        if (res && res.status === 200) {
          this.isPasswordFilledVisible = true; // OTP valid, show password field
          this.token=res.error.token
          // console.log(token)
        } else if (res && res.status === 201) {
          this.messageService.add({ severity: 'warn', summary: 'Invalid OTP', life: 3000 });
        } else if (res && res.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'Bad Request', detail: 'Invalid input or OTP.', life: 3000 });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An unexpected error occurred.', life: 3000 });
        }
      },
      error: (err: any) => {
        // This block will execute if an error occurs (e.g., network issue, server error)
        console.error('Error occurred:', err);
        this.messageService.add({ severity: 'error', summary: 'Request Failed', detail: 'There was an issue with the OTP verification. Please try again.', life: 3000 });
      }
    })
    

  }
  if(this.isPasswordFilledVisible){
    console.log(this.token)
    this.loginService.resetPassword({jwtToken:this.token,password:this.updateInfoForm.value.password}).subscribe((res:any)=>{
      if(res.status==200){
        this.visible=false;
        this.messageService.add({ severity: 'info', summary: 'Your password has been updated successfully', life: 3000 });
      }
    })
  }

}
else{
  Object.keys(this.updateInfoForm.controls).forEach(controlName => {
    this.updateInfoForm.get('email')?.markAsTouched();
  });
}



  // this.updateInfoForm.reset();

}
resetForm() {
  this.updateInfoForm.reset({
    email: '',
    password: '',
    otp: ''
  });
  this.formSubmitted = false;
  // Mark the form controls as untouched and pristine to prevent immediate validation
  this.updateInfoForm.markAsUntouched();
  this.updateInfoForm.markAsPristine();
}
}
