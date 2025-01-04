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

  constructor(private sidebarService: SidebarService) {}

  ngOnInit(): void {
    this.sidebarItems = this.sidebarService.getSidebarItems();
  }

  ActiveMenu(index: number,item:any) {

    this.activeIndex = index;

    // this.router.navigate(item.route)
  }
}
