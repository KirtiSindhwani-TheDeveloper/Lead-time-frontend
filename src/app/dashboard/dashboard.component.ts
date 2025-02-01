import { Component } from '@angular/core';
import { HeaderComponent } from "../core/header/header.component";
import { SidebarComponent } from "../core/sidebar/sidebar.component";
import { MessageService, SharedModule } from 'primeng/api';
import { PrimengModule } from '../shared/primeng/primeng.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavigationStart, Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, SidebarComponent,PrimengModule],
  providers:[MessageService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  userName:any;

  constructor(private messageService:MessageService,private router:Router){

   
  }
  ngOnInit(){
    this.userName=localStorage.getItem('name');
    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationStart) {
    //     // Trigger the toast when a route change starts
    //     this.messageService.add({
    //       severity: 'info',
    //       summary: 'Navigating',
    //       detail: `You are navigating to: ${event.url}`,
    //       life: 3000
    //     });
    //   }
    // });
    this.messageService.add({ severity: 'success', summary:'Login Successfully', life: 300000 });
  }
}
