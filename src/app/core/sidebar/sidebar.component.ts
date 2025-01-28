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



  // Toggle the submenu visibility and active state
  toggleSubMenu(item: any) {
    item.isOpen = !item.isOpen;  // Toggle submenu visibility
    // Close other submenus if needed (optional)

    this.sidebarItems.forEach((subItem:any) => {
      if (subItem !== item) {
        subItem.isOpen = false;  // Close other submenus
      }
    });
  }

   setActive(item: any) {
    // Reset the active state for all menu items and submenus
    this.sidebarItems.forEach((menuItem: any) => {
      menuItem.isActive = false;  // Reset active state for main items

      if (menuItem.submenu) {
        menuItem.submenu.forEach((subItem: any) => {
          subItem.isActive = false;  // Reset active state for submenus
        });
      }
    });

    // Set the clicked item as active
    item.isActive = true;

    // If it's a submenu item, set its parent item as active as well
    if (item.submenu) {
      item.submenu.forEach((subItem: any) => {
        subItem.isActive = true;  // Mark active state for submenus if needed
      });
    }
  }

  
}
