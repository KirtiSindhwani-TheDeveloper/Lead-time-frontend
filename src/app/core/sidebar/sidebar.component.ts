import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PrimengModule } from '../../shared/primeng/primeng.module';
import { SharedModule } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { SharedServiceService } from '../../services/shared-service.service';

@Component({
  selector: 'app-sidebar',
  //changeDetection: ChangeDetectionStrategy.OnPush,
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

  allModules:any=[];
  modules:any=[];
  mainModules:any=[];
  subchildren:any=[];
  // constructor(private router:Router){

  // }
  sidebarItems:any = [];

  constructor(private sidebarService: SidebarService,private router: Router,private sharedService:SharedServiceService) {}

  ngOnInit(): void {
  //  this.sidebarItems = this.sidebarService.getSidebarItems();
    //console.log("isde bar items ",this.sidebarItems)
    this.getModules();
  }
  

  ActiveMenu(index: number,item:any) {

    this.activeIndex = index;

    // this.router.navigate(item.route)
  }



  // Toggle the submenu visibility and active state
  // toggleSubMenu(item: any) {
  //   item.isOpen = !item.isOpen;  // Toggle submenu visibility
  //   // Close other submenus if needed (optional)

  //   this.sidebarItems.forEach((subItem:any) => {
  //     if (subItem !== item) {
  //       subItem.isOpen = false;  // Close other submenus
  //     }
  //   });
  // }

  //  setActive(item: any) {
  //   // Reset the active state for all menu items and submenus
  //   this.sidebarItems.forEach((menuItem: any) => {
  //     menuItem.isActive = false;  // Reset active state for main items

  //     if (menuItem.subchildren) {
  //       menuItem.submodules.forEach((subItem: any) => {
  //         subItem.isActive = false;  // Reset active state for submenus
  //       });
  //     }
  //   });

  //   // Set the clicked item as active
  //   item.isActive = true;
   

  //  // If it's a submenu item, set its parent item as active as well
  //   if (item.submodules) {
  //     item.submodules.forEach((subItem: any) => {
  //       subItem.isActive = true;  // Mark active state for submenus if needed
  //     });
  //    }
  // }
  
  toggleSubMenu(item: any) {
    // Check if the clicked submenu is already open. If so, close it; otherwise, open it.
    item.isOpen = !item.isOpen;
  
    // Close other submenus
    this.sidebarItems.forEach((subItem: any) => {
      if (subItem !== item) {
        subItem.isOpen = false;  // Close other submenus
      }
    });
  }
  
  setActive(subItem: any, parentItem: any) {

   // console.log(subItem);
    // Reset the active state for all main menu items and submenus
    this.sidebarItems.forEach((menuItem: any) => {
      menuItem.isActive = false;  // Reset active state for all main items
      menuItem.subchildren.forEach((sub: any) => {
        sub.isActive = false;  // Reset active state for all submenus
      });
    });
  
    // Set the clicked submenu item as active
    subItem.isActive = true;
  
    // Also set the parent main menu item as active
    parentItem.isActive = true;
  
    // Ensure that the parent submenu is opened
    parentItem.isOpen = true;
  }
  
  getModules(){
    
    //console.log(this.sidebarItems)
    this.sidebarService.getModules().subscribe((res:any)=>{
      this.modules=res.data;
      //console.log("modules ",this.modules)
     this.transformData(this.modules)
    })
  }

  transformData(data: any) {
    const groupedData: { [key: string]: any } = {};

    // Group data by parentModuleName
    data.forEach((item:any) => {
      const parentName = item.parentModuleName;

      // Initialize the parent if not already present
      if (!groupedData[parentName]) {
        groupedData[parentName] = {
          parentModuleName: parentName,
          subchildren: []
        };
      }

      // Push the module data into the subchildren array
      const subchild = {
        module_name: item.module_name,
        module_route: item.module_route,
        add1: item.add1,
        delete1: item.delete1,
        edit1: item.edit1,
        isActive: item.isActive,
        view1: item.view1
      };

      groupedData[parentName].subchildren.push(subchild);
    });

    // Return the grouped result
   // console.log(Object.values(groupedData))
    this.sidebarItems=Object.values(groupedData);
    this.sendDataToUser(this.sidebarItems)
    return Object.values(groupedData);
  }

  sendDataToUser(data:any) {
    
    this.sharedService.updateSidebarData(data);
  }
  
}
