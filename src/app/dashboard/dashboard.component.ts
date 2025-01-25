import { Component } from '@angular/core';
import { HeaderComponent } from "../core/header/header.component";
import { SidebarComponent } from "../core/sidebar/sidebar.component";

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  userName:any;

  ngOnInit(){
    this.userName=localStorage.getItem('name')
  }
}
