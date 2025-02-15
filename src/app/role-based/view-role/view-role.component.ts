import { Component } from '@angular/core';
import { HeaderComponent } from "../../core/header/header.component";
import { PrimengModule } from '../../shared/primeng/primeng.module';
import { SharedModule } from '../../shared/shared.module';
import { SidebarComponent } from "../../core/sidebar/sidebar.component";
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { RoleBasedService } from '../../services/role-based.service';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UtilitiesService } from '../../services/utilities.service';
import saveAs from 'file-saver';
import { Subscription } from 'rxjs';
import { SharedServiceService } from '../../services/shared-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-role',
  standalone: true,
  imports: [HeaderComponent,MatSlideToggleModule, PrimengModule, SharedModule, SidebarComponent,FormsModule,CommonModule],
  providers:[MessageService],
  templateUrl: './view-role.component.html',
  styleUrl: './view-role.component.css'
})
export class ViewRoleComponent {
  isLoading:boolean=false;
  userId:any;
 // roles:any=[]
  areCheckboxesEnabled:boolean=false;
  isSubmitEnabled:boolean=false;
 token:any;
  roles :any=[];
  visible:boolean=false;
  allModules:any=[];
  mainModules:any=[]
  modules:any=[];
  roleId:any;
  associatedVerticalsOnView:any=[];
  subModules:any=[];
  roleStatus:any;
  associatedBusinesses:any=[];
  userPermissions:any;
  receivedData:any;
  currentRoute:any;
  dataSubscription:Subscription|null=null;
  constructor(private roleService:RoleBasedService,private messageService:MessageService,
    private utilitiesService:UtilitiesService,private sharedService:SharedServiceService,
    private router:Router
  ){
    this.viewRole();
    this.token=localStorage.getItem('authToken');
    this.userId=localStorage.getItem('userId');
    this.currentRoute=router.url;
  }

  showDialog(){
    this.visible=false;
  }

  enableCheckboxes() {
    this.areCheckboxesEnabled = true; // Enable checkboxes when action button is clicked
    this.isSubmitEnabled = true; // Enable the submit button
  }

  setToggleState(product: any): boolean {
    return product.status === 'Active'; // true if 'Active', false if 'Inactive'
  }

  onStatusChange(product: any,status:any) {
    // this.setToggleStatus(product, this.getToggleStatus(product));
    //let status=product.status === 'Active' ? 'Inactive' : 'Active'
    // This ensures that the status is updated correctly when toggling
    product.status = product.status === 'Active' ? 'Inactive' : 'Active';

    console.log(product);
    this.isLoading=true;
    this.roleService.deleteRole({...product,token:this.token,loginUserId:this.userId}).subscribe((res:any)=>{
      this.isLoading=false;
      this.viewRole();
    },(error:any)=>{
      this.isLoading=false;
    })
}
  updateRoleState(role: any, field: string, event: any) {
    role[field] = event.checked;
   // console.log(`${field} updated for ${role.name}: `, role[field],role);
  }

  selectedRow: number | null = null; // Track the selected row index
 

  ngOnInit(){
    this.getBusinessVerticals();
    this.dataSubscription = this.sharedService.sidebarData.subscribe(
      (data) => {
        this.receivedData = data;
       // console.log('Data received in User:', this.receivedData);
        if(this.receivedData!=null){

          for(let item of this.receivedData){
            const moduleItem = item.subchildren.find((child:any) => child.module_route === this.currentRoute);
  
  if (moduleItem) {
    // Extract values if module is found
    this.userPermissions = {
      view1: moduleItem.view1,
      add1: moduleItem.add1,
      delete1: moduleItem.delete1,
      edit1: moduleItem.edit1
    };
   
  }
          }
        }
        console.log("result",this.userPermissions)
       
      }
    );
  }

  editRow(index: number,rowData:any) {
    this.selectedRow = index; // Set the selected row index
    this.isSubmitEnabled = true; // Enable the submit button for the selected row
    this.visible=true;
    this.roleId=rowData.id;
    this.associatedVerticalsOnView=rowData
    this.isLoading=true;
    
    const selectedIds =[];
    this.roleStatus=rowData.status
   // console.log("rowData ",rowData)
    // Loop through the form values
    for (let key in rowData) {
      
      //console.log(key)
      if (rowData[key]) {
        // Push the mapped ID for each checked checkbox
        const selectedItem = this.associatedBusinesses.find((item:any) => item.business_vertical === key.toLocaleUpperCase());
        //console.log(selectedItem)
        if (selectedItem) {
          selectedIds.push(selectedItem.id);  // Push the corresponding ID
        }
      }
      
    }
    this.roleService.getEditModulesBasedOnBVID({vertical_ids:selectedIds,roleId:rowData.id}).subscribe((res:any)=>{
      this.modules=res.data;
      this.isLoading=false;
      this.organizeModules();
      //console.log("allModules ",this.modules)
      this.isLoading=false;
    },(error:any)=>{
      this.isLoading=false;
    })
  }

  organizeModules() {
    
    this.mainModules = this.modules.filter((module:any) => module?.parentId === 0);
    this.subModules = this.modules.filter((module:any) => module?.parentId !== 0);
   // console.log("main and sub",this.mainModules,this.subModules)
   this.mainModules.forEach((mainModule: any) => {
    mainModule.view1=false;
    mainModule.edit1=false;
    mainModule.delete1=false;
    mainModule.add1=false;
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

   // Toggle the "All" checkbox for all submodules
 toggleAllForModule(module: any,event:any,index:any,eventString:string): void {
  
  module.submodules.forEach((submodule: any,i:any) => {

    if(index==i){
      if(eventString=='all'){
        submodule.all = event.checked;
        submodule.view1 = event.checked;
        submodule.edit1 = event.checked;
        submodule.add1 = event.checked;
        submodule.delete1 = event.checked;
      }
      else{
        submodule.all=false;
      }
    //   if(eventString=='view' && eventString=='add' && eventString=='delete' && eventString=='edit'){
    // submodule.all=true;        
    //   }
    }
    
  });
  //console.log("submodules ",event,module.submodules)
}
 
  getBusinessVerticals(){
    this.utilitiesService.getBusinessVertical().subscribe((res:any)=>{
      // this.isLoading=false;
      this.associatedBusinesses=res.data;
      // this.getModules();
      
    },(error:any)=>{
      this.isLoading=false
     // console.log("vertical error ",error)
    })
  }
  // Submit the selected row's data
  submit(index?:any) {
    
    // else{
      this.isLoading=true;
     // console.log("modules ",this.allModules)
      let filteredModules=[];
      for(let item of this.allModules){

          const filteredArray = item.submodules.filter((module:any) => 
            !(module.view1 === false && module.edit1 === false && module.add1 === false && module.delete1 === false)
          );
          if(filteredArray.length>0){
            filteredModules.push(filteredArray)

          }
      }
  // console.log("filtered array ",filteredModules)
     
      this.roleService.editRole({modules:filteredModules,token:this.token,userId:this.userId,roleId:this.roleId,status:this.roleStatus,verticals:this.associatedVerticalsOnView}).subscribe((res:any)=>{
        this.isLoading=false;
        this.messageService.add({severity:'success',summary:'Role updated successfully',life:10000})
        this.viewRole();
        this.visible=false;
      },(error:any)=>{
        this.isLoading=false;
        this.messageService.add({summary:'Error in Updating Role!!',life:3300000,severity:'error'})
        this.visible=false;
      })
      //console.log('Updating role:', rowData);
      this.selectedRow = null; // Reset selected row after submission
      this.isSubmitEnabled = false; // Disable submit button after submission
 //   }
  }

  viewRole(){
    this.isLoading=true;
    this.roleService.viewRole().subscribe((res:any)=>{
      this.isLoading=false;
      this.roles=res.data;

      this.roles = this.roles.map((item: any) => ({
        ...item,
        status: item.status === true ? 'Active' : 'Inactive',  // Convert status to 'active' if true
        showErrorMessage: false
      }));
    },(error:any)=>{
      this.isLoading=false;
    })
  }

  

}
