import { Component } from '@angular/core';
import { HeaderComponent } from "../../core/header/header.component";
import { PrimengModule } from '../../shared/primeng/primeng.module';
import { SharedModule } from '../../shared/shared.module';
import { SidebarComponent } from "../../core/sidebar/sidebar.component";
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-view-role',
  standalone: true,
  imports: [HeaderComponent, PrimengModule, SharedModule, SidebarComponent,FormsModule],
  providers:[MessageService],
  templateUrl: './view-role.component.html',
  styleUrl: './view-role.component.css'
})
export class ViewRoleComponent {
  isLoading:boolean=false;
 // roles:any=[]
  areCheckboxesEnabled:boolean=false;
  isSubmitEnabled:boolean=false;

  roles = [
    { name: 'Admin', sims: false, audit: true, gainer: false, it: false, hr: false, others: false },
    { name: 'Manager', sims: false, audit: false, gainer: false, it: false, hr: false, others: false },
    { name: 'Employee', sims: true, audit: false, gainer: false, it: false, hr: false, others: false }
  ];
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
  submit(role: any) {
    // Handle the submit logic
    console.log('Updating role:', role);
    this.selectedRow = null; // Reset selected row after submission
    this.isSubmitEnabled = false; // Disable submit button after submission
  }
}
