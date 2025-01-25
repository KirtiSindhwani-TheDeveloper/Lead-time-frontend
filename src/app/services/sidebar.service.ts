import { Injectable } from '@angular/core';

interface SidebarItem {
  id:Number;
  label: string;
  route: string;
  roles: string[];  // Specify roles that can see this menu item
submenu?: SidebarItem[];
}
@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  private sidebarItems: any = [
    // { id:1 ,label: 'Dashboard', route: '/', roles: ['admin', 'user'] },
    {
      label: 'Lead Time Calculator', // Main item for the submenu
      roles: ['admin', 'user'],
      route:'/dashboard',
      isActive:true,
      submenu:[

        { id:2 ,label: 'LT Upload', route: '/app-upload', roles: ['admin', 'user'] },
        { id:3 ,label: 'LT Export', route: '/app-export', roles: ['admin','user'] },
      ]
    }
    // { id:4 ,label: 'User', route: '/view-user', roles: ['admin','user'] },
    // { id:4 ,label: 'LT Mapping master', route: '/create', roles: ['user','admin'] },

  ];

  // Simulate getting current user roles (could be fetched from a backend service)
  private currentUserRoles = ['user']; // This would be dynamic in a real app

  constructor() { }

  // Return sidebar items based on current user roles
  getSidebarItems() {
    return this.sidebarItems.filter((item:any) =>
      item.roles.some((role:any) => this.currentUserRoles.includes(role))
    );
  }
}
