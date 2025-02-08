import { Component } from '@angular/core';
import { PrimengModule } from '../../shared/primeng/primeng.module';
import { HeaderComponent } from "../../core/header/header.component";
import { SidebarComponent } from "../../core/sidebar/sidebar.component";
import { RoleBasedService } from '../../services/role-based.service';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { atLeastOneCheckedValidator } from '../../shared/validators/atLeastOnCheckedValidator';
import { MessageService } from 'primeng/api';
import { UtilitiesService } from '../../services/utilities.service';
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
  visible:boolean=false;
  // customers = [
  //   {
  //     name: 'John Doe',
  //     industry: 'Technology',
  //     segment: 'Retail',
  //     status: 'Active',
  //     contactNo: '1234567890',
  //     address: '1234 Elm Street',
  //   },
  //   {
  //     name: 'Jane Smith',
  //     industry: 'Finance',
  //     segment: 'Wholesale',
  //     status: 'Inactive',
  //     contactNo: '9876543210',
  //     address: '5678 Oak Avenue',
  //   },
  //   {
  //     name: 'John Doe',
  //     industry: 'Technology',
  //     segment: 'Retail',
  //     status: 'Active',
  //     contactNo: '1234567890',
  //     address: '1234 Elm Street',
  //   },
  //   {
  //     name: 'Jane Smith',
  //     industry: 'Finance',
  //     segment: 'Wholesale',
  //     status: 'Inactive',
  //     contactNo: '9876543210',
  //     address: '5678 Oak Avenue',
  //   },
  //   {
  //     name: 'John Doe',
  //     industry: 'Technology',
  //     segment: 'Retail',
  //     status: 'Active',
  //     contactNo: '1234567890',
  //     address: '1234 Elm Street',
  //   },
  //   {
  //     name: 'Jane Smith',
  //     industry: 'Finance',
  //     segment: 'Wholesale',
  //     status: 'Inactive',
  //     contactNo: '9876543210',
  //     address: '5678 Oak Avenue',
  //   },
  //   {
  //     name: 'John Doe',
  //     industry: 'Technology',
  //     segment: 'Retail',
  //     status: 'Active',
  //     contactNo: '1234567890',
  //     address: '1234 Elm Street',
  //   },
  //   {
  //     name: 'Jane Smith',
  //     industry: 'Finance',
  //     segment: 'Wholesale',
  //     status: 'Inactive',
  //     contactNo: '9876543210',
  //     address: '5678 Oak Avenue',
  //   },
  //   {
  //     name: 'John Doe',
  //     industry: 'Technology',
  //     segment: 'Retail',
  //     status: 'Active',
  //     contactNo: '1234567890',
  //     address: '1234 Elm Street',
  //   },
  //   {
  //     name: 'Jane Smith',
  //     industry: 'Finance',
  //     segment: 'Wholesale',
  //     status: 'Inactive',
  //     contactNo: '9876543210',
  //     address: '5678 Oak Avenue',
  //   },
  //   {
  //     name: 'John Doe',
  //     industry: 'Technology',
  //     segment: 'Retail',
  //     status: 'Active',
  //     contactNo: '1234567890',
  //     address: '1234 Elm Street',
  //   },
  //   {
  //     name: 'Jane Smith',
  //     industry: 'Finance',
  //     segment: 'Wholesale',
  //     status: 'Inactive',
  //     contactNo: '9876543210',
  //     address: '5678 Oak Avenue',
  //   },
  //   {
  //     name: 'John Doe',
  //     industry: 'Technology',
  //     segment: 'Retail',
  //     status: 'Active',
  //     contactNo: '1234567890',
  //     address: '1234 Elm Street',
  //   },
  //   {
  //     name: 'Jane Smith',
  //     industry: 'Finance',
  //     segment: 'Wholesale',
  //     status: 'Inactive',
  //     contactNo: '9876543210',
  //     address: '5678 Oak Avenue',
  //   }
  // ];
  modules:any;
  userId:any;
  roleForm:FormGroup
  token:any;
  mainModules: any = [];
  subModules: any = [];
  allModules:any=[];
  associatedBusinesses:any=[];
  constructor(private roleService:RoleBasedService,
    private fb:FormBuilder,private messageService:MessageService,
    private utilitiesService:UtilitiesService
  ){
    this.roleForm = this.fb.group({
      rolename: ['', Validators.required],
     
      checkboxes: this.fb.group(
        {
          SIMS: [0],    // default is 0 (unchecked)
          AUDIT: [0],
          GAINER: [0],
          IT: [0],
          HR: [0],
          OTHERS: [0]
        },
        { validators: atLeastOneCheckedValidator } // custom validator for at least one checkbox
      
      )
    });
    this.roleForm
      .get('checkboxes')
      ?.valueChanges.subscribe(() => this.checkAtLeastOneChecked());
  
    this.userId=localStorage.getItem('userId');
    this.token=localStorage.getItem('authToken');
    
  }

  getModules(){
    
    this.roleService.getModules().subscribe((res:any)=>{
      this.modules=res.data;
      //console.log("modules ",this.modules)
      this.organizeModules()
    })
  }
  ngOnInit(){
    
    this.getBusinessVerticals();
  }

  getModulesBasedonBVID(){
    let data;
    this.roleService.getModulesBasedOnBVID(data).subscribe((res:any)=>{

    })
  }
 // Toggle the "All" checkbox for all submodules
 toggleAllForModule(module: any,event:any,index:any): void {
  
  module.submodules.forEach((submodule: any,i:any) => {

    if(index==i){
      submodule.view1 = event.checked;
      submodule.edit1 = event.checked;
      submodule.add1 = event.checked;
      submodule.delete1 = event.checked;

    }
  });
  console.log("submodules ",event,module.submodules)
}

// Handling the checkbox change event for individual checkboxes
onCheckboxChange(submodule: any, checkboxType: string): void {
  // You can handle any additional logic here
  console.log(`Checkbox changed for ${checkboxType} of submodule with ID: ${submodule.id}`);
}

  organizeModules() {
    
    this.mainModules = this.modules.filter((module:any) => module?.parentId === 0);
    this.subModules = this.modules.filter((module:any) => module?.parentId !== 0);
   // console.log("main and sub",this.mainModules,this.subModules)
   this.mainModules.forEach((mainModule: any) => {
    const submodulesForMainModule = this.subModules.filter((submodule: any) => submodule.parentId === mainModule.id);
  
    // Step 4: Add parent module's name to each submodule
    submodulesForMainModule.forEach((submodule: any) => {
      submodule.parentModuleName = mainModule.module_name; // Add parent module name to submodule
  
      // Find the business vertical by matching the business_vertical_id with the id in associatedBusinesses
      const businessVertical = this.associatedBusinesses.find((obj: any) => submodule.business_vertical_id
      == obj.id);
  
      // Check if businessVertical is found, and if so, add the business_vertical name to the submodule
      if (businessVertical) {
        submodule.businessVerticalName = businessVertical.business_vertical;
      } else {
        // Handle the case when no matching business vertical is found
        console.warn(`Business vertical not found for submodule with id: ${submodule.id}`);
      }
    });
  
    // Attach the submodules to the main module
    mainModule.submodules = submodulesForMainModule;
  });
  
   
    // Step 3: Combine main modules and their submodules into a single array
    this.allModules = this.mainModules;
    // console.log("all modules ",this.allModules)
  }


  checkAtLeastOneChecked() {
    const checkboxes = this.roleForm.get('checkboxes')?.value;
    const isAnyChecked = Object.values(checkboxes).some((value) => value === true);

    if (!isAnyChecked) {
      this.roleForm.get('checkboxes')?.setErrors({ atLeastOneRequired: true });
    } else {
      this.roleForm.get('checkboxes')?.setErrors(null);
    }
  }
  
  get checkboxes() {
    return this.roleForm.get('checkboxes') as FormGroup;
  }
  get rolename() {
    return this.roleForm.get('rolename');
  }

  showDialog(){
    this.visible=true;
  }

  getBusinessVerticals(){
    this.utilitiesService.getBusinessVertical().subscribe((res:any)=>{
      // this.isLoading=false;
      this.associatedBusinesses=res.data;
      this.getModules();
      
    },(error:any)=>{
      this.isLoading=false
      console.log("vertical error ",error)
    })
  }
  
  submit(){
    if(this.roleForm.valid){

      let formValues = this.roleForm.value;
      // console.log("form value ",this.roleForm.value)
      // for (let key in formValues.checkboxes) {
      //   if (formValues[key] === true) {
      //     formValues[key] = 1;  // If checkbox is checked, set it to an array with '1'
      //   } else if (formValues[key] === false) {
      //     formValues[key] = 0;  // If checkbox is unchecked, set it to 0
      //   }
      // }
  
      this.isLoading=true;
      console.log(formValues);
      this.roleService.createRole({...formValues,...formValues.checkboxes,userId:this.userId,token:this.token}).subscribe((res:any)=>{
        this.isLoading=false;
        this.roleForm.reset();
        this.messageService.add({severity:'success' ,summary:'Role has created Successfully',life:10000})
      },(error:any)=>{
        this.isLoading=false;
        this.roleForm.reset();
        this.messageService.add({severity:'error',detail:'There is some error in creating role..',life:3000000000});
      })
    }
    else{
      
      Object.keys(this.roleForm.controls).forEach(controlName => {
        const control = this.roleForm.get(controlName);
  
          // Mark regular form controls (like rolename) as touched
          control?.markAsTouched();
        
      });
      const checkboxes = this.roleForm.get('checkboxes')?.value;
  const isAnyChecked = Object.values(checkboxes).includes(true);

  // If no checkbox is selected, manually set the 'atLeastOneRequired' error
  if (!isAnyChecked) {
    this.roleForm.get('checkboxes')?.setErrors({ atLeastOneRequired: true });
  } else {
    // If at least one checkbox is selected, clear the error (if it exists)
    this.roleForm.get('checkboxes')?.setErrors(null);
  }

      
    }
  }
}
