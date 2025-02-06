import { Component } from '@angular/core';
import { PrimengModule } from '../../shared/primeng/primeng.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import {CommonModule} from '@angular/common';
@Component({
  selector: 'app-update-password-while-create-user',
  standalone: true,
  imports: [PrimengModule,FormsModule,CommonModule,ReactiveFormsModule],
  providers:[MessageService],
  templateUrl: './update-password-while-create-user.component.html',
  styleUrl: './update-password-while-create-user.component.css'
})
export class UpdatePasswordWhileCreateUserComponent {

  email:any;
  password:any;
  isLoading:boolean=false;
  qrCodeUrl:any;
  isSubmitted:boolean=false;
  OTP:any;
  secretKey:any;
  passwordMessage:any;
  emailMessage:any;
  emailArray:any=[];
  userName:any;
  updateForm:FormGroup;
  isOtpVerified:boolean=false;
  expiryTime: any;
  isLinkValid: boolean=true;
  constructor(private authService:AuthService,private messageService:MessageService,private router:Router,
    private fb:FormBuilder,private activatedRoute:ActivatedRoute){
    this.updateForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],

      OTP: ['', Validators.required],
    });
    
   
  }

  ngOnInit(){
    this.activatedRoute.queryParams.subscribe(params => {
      this.expiryTime = parseInt(params['expiry'], 10);
      this.checkLinkValidity();
    });
    this.authService.checkEmail({email:this.email}).subscribe(
      (response) => {
        this.emailArray=response.data;
        console.log(this.emailArray)
      },
      (error) => {
       
      }
    );
  }

  checkLinkValidity() {
    const currentTime = Date.now();
    if (this.expiryTime && currentTime <= this.expiryTime) {
      this.isLinkValid = true;
    } else {
      this.isLinkValid = false;
    }
  }

  validPassword(){
    this.passwordMessage=''
    let nameExist=false;
    if(this.updateForm.value.password.toLowerCase().includes(this.userName.replace(/\s/g, '').toLowerCase())){
     // console.log("password ",this.updateForm.value.password,this.userName)
      this.passwordMessage='your user name doesnot contains in password';
      nameExist=true;
    }
let password=this.updateForm.value.password
    if (password.length < 8 || password.length > 16) {
      this.passwordMessage+= "Password must be between 8 and 16 characters.";
    }
    if (!/[A-Z]/.test(password)) {
      this.passwordMessage+=  "Password must contain at least one uppercase letter.";
    }
    if (!/[a-z]/.test(password)) {
      this.passwordMessage+=  "Password must contain at least one lowercase letter.";
    }
    if (!/\d/.test(password)) {
      this.passwordMessage+=  "Password must contain at least one digit.";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      this.passwordMessage+=  "Password must contain at least one special character.";
    }
    if (/\s/.test(password)) {
      this.passwordMessage+=  "Password must not contain spaces.";
    }

    return "Password is valid.";

  }

  checkEmailAvailability() {
    this.emailMessage = '';

    // Loop through the email array to check if the entered email exists
    let emailExists = false;
    
    this.emailArray.forEach((item: any) => {
      // Check if the email exists in the array
      if (item.emailId === this.updateForm.value.email) {
        this.emailMessage = '';
        this.userName=item.name
        emailExists = true; // Email found, set flag to true
        // console.log(item.emailId, this.updateForm.value.email, this.emailMessage);
      }
    });
  
    // If email is not found in the array, update the message
    if (!emailExists && this.updateForm.value.email) {
      this.emailMessage = 'User does not exist. Enter a valid email!';
      // console.log(this.emailMessage);
    }
   
  }

  verifyOTP(){
    
    if(this.updateForm.value.OTP!=''){
      this.isLoading=true;
      this.authService.twoFactorAuthentication({token:this.updateForm.value.OTP,secret:this.secretKey}).subscribe( (response) => {
        // this.messageService.add({severity:'success',life:300000,summary:'Invalid OTP',detail:'Try Again!!'})
         this.isLoading=false;
        this.isOtpVerified=true;
        
              //this.router.navigate(['/dashboard']);
              // this.OTP=''
        // alert('2FA verified successfully!');
      },
      (error) => {
        this.isLoading=false;
        this.OTP=''
        this.messageService.add({severity:'error',life:300000,summary:'Invalid OTP',detail:'Try re-scanning QR Code Again!!'})
        // alert('Invalid OTP');
      })
    }
    else{
      Object.keys(this.updateForm.controls).forEach((controlName:any)=>{
        this.updateForm.get(controlName)?.markAsTouched()
      })
    }
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

  submit(){

    if(!this.isOtpVerified && this.updateForm.valid){
      this.messageService.add({severity:'error',life:300000,summary:'Kindly do the Authentication  !!!'})
      return;
    }
    if(this.updateForm.valid && this.emailMessage=='' && this.passwordMessage==''){
      this.isLoading=true;
      let data={
        email:this.updateForm.value.email,
        password:this.updateForm.value.password,
        secretKey:this.secretKey,
      }
      console.log("submit ",data)
      this.authService.updatePasswordWhileCreatingUser(data).subscribe((res:any)=>{
        this.isLoading=false;
          this.isSubmitted=true;
      },(error:any)=>{
        this.isLoading=false;
      })
    }
    else{
      Object.keys(this.updateForm.controls).forEach((controlName)=>{
        this.updateForm.get(controlName)?.markAsTouched();
      })
    }
  }
}
