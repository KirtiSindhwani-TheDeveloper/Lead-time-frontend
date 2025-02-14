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
  }
  ngAfterViewInit(){
    
    // if (localStorage.getItem('isLoggedIn') === 'true') {
    //   // Show a toast message
    //   // console.log("taost is appearing")
    //   this.messageService.add({
    //     severity: 'success',
    //     summary: 'Welcome!',
    //     detail: 'You are now logged in.',
    //     life: 300000
    //   });
    // } else {
    //   // Redirect to login page if not logged in
    //   this.router.navigate(['/login']);
    // }

  }
}
