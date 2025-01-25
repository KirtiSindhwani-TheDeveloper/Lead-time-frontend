import { Component } from '@angular/core';
import { PrimengModule } from '../../shared/primeng/primeng.module';
import { SharedModule } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  imports: [PrimengModule,SharedModule,ReactiveFormsModule,FormsModule,RouterModule,CommonModule],

  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  activeIndex: number | null = null;


  sideBarList = [
   {id:1 , value: "Dashboard"},

   {id:2 , value: "LT Upload",route:'/app-upload'},
   {id:3 , value: "LT Export",route:'/app-export'},
  //  {id:4 , value: "LT Mapping master",route:'/create'}
  ]
  // constructor(private router:Router){

  // }
  sidebarItems:any = [];

  constructor(private sidebarService: SidebarService,private router: Router) {}

  ngOnInit(): void {
    this.sidebarItems = this.sidebarService.getSidebarItems();
  }
  

  ActiveMenu(index: number,item:any) {

    this.activeIndex = index;

    // this.router.navigate(item.route)
  }
  // highlightActiveMenu() {
  //   const currentRoute = this.router.url; // Get the current route path

  //   // Iterate over sidebar items and submenus to set the active state
  //   this.sidebarItems.forEach((item:any) => {
  //     // Reset active state for main menu and submenus
  //     item.isActive = false;
  //     if (item.submenu) {
  //       item.submenu.forEach((subItem:any) => {
  //         // Highlight submenus if their route matches the current route
  //         if (currentRoute === subItem.route) {
  //           subItem.isActive = true;
  //           item.isActive = true;  // Highlight main item if any submenu is active
  //         } else {
  //           subItem.isActive = false;
  //         }
  //       });
  //     }
  //     // Highlight the main item if its route matches the current route
  //     if (currentRoute === item.route) {
  //       item.isActive = true;
  //     }
  //   });
  // }

  // Toggle submenu visibility on click
  toggleSubmenu(item: any): void {
    console.log("item ",item)
    item.isOpen = !item.isOpen;
    //this.highlightActiveMenu(); // Re-check active state after submenu toggle
  }
  
}
