import { Component } from '@angular/core';
import { HeaderComponent } from "../../core/header/header.component";
import { PrimengModule } from '../../shared/primeng/primeng.module';
import { SharedModule } from '../../shared/shared.module';
import { SidebarComponent } from "../../core/sidebar/sidebar.component";
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { RoleBasedService } from '../../services/role-based.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-role',
  standalone: true,
  imports: [HeaderComponent, PrimengModule, SharedModule, SidebarComponent,FormsModule,CommonModule],
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


  constructor(private roleService:RoleBasedService,private messageService:MessageService){
    this.viewRole();
    this.token=localStorage.getItem('authToken');
    this.userId=localStorage.getItem('userId');
  }

  enableCheckboxes() {
    this.areCheckboxesEnabled = true; // Enable checkboxes when action button is clicked
    this.isSubmitEnabled = true; // Enable the submit button
  }

  updateRoleState(role: any, field: string, event: any) {
    role[field] = event.checked;
    console.log(`${field} updated for ${role.name}: `, role[field],role);
  }

  selectedRow: number | null = null; // Track the selected row index
 

  editRow(index: number) {
    this.selectedRow = index; // Set the selected row index
    this.isSubmitEnabled = true; // Enable the submit button for the selected row
  }

  // Submit the selected row's data
  submit(rowData: any,index?:any) {
    // Handle the submit logic
   
      
  
    if((!rowData.audit) && !rowData.gainer&& !rowData.it && !rowData.other && !rowData.sims){
      // console.log("index",index,this.roles[index])
      const role = this.roles.find((r:any) => r.id === rowData.id);
      if (role) {
        role.showErrorMessage = true;
    }
    }
    
    else{
      this.isLoading=true;
      this.roleService.editRole({...rowData,token:this.token,userId:this.userId}).subscribe((res:any)=>{
        this.isLoading=false;
        this.messageService.add({severity:'success',summary:'Role updated successfully',life:30000})
        this.viewRole();
      },(error:any)=>{
        this.isLoading=false;
      })
      console.log('Updating role:', rowData);
      this.selectedRow = null; // Reset selected row after submission
      this.isSubmitEnabled = false; // Disable submit button after submission
    }
  }

  viewRole(){
    this.isLoading=true;
    this.roleService.viewRole().subscribe((res:any)=>{
      this.isLoading=false;
      this.roles=res.data;

      this.roles.map((item:any) => ({
        
        ...item,
        showErrorMessage:false
      }));
    },(error:any)=>{
      this.isLoading=false;
    })
  }
}
