import { Routes } from '@angular/router';
import { CreateMappingComponent } from './mapping-master/create-mapping/create-mapping.component';
import { CreateComponent } from './upload/create/create.component';
import { CreateUserComponent } from './user-management/create-user/create-user.component';
import { CreateExportComponent } from './export/create-export/create-export.component';
import { LoginComponent } from './core/login/login.component';
import { ViewUserComponent } from './user-management/view-user/view-user.component';
import { authGuard } from './auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';


export const routes: Routes = [
    {
        path:'create',component:CreateMappingComponent
      },
      {
        path:'dashboard',
        component:DashboardComponent,
        canActivate:[authGuard]
    },
      {
        path: 'app-upload',
        component: CreateComponent,
        canActivate:[authGuard]
    },
    {
        path: 'app-export',
        component: CreateExportComponent,
        canActivate:[authGuard]
    },
   
    {
        path: 'create-user',
        component: CreateUserComponent,
         canActivate:[authGuard]
    },
    {
        path:'login',
        component:LoginComponent,
    },
    {
        path:'view-user',
        component:ViewUserComponent,
       
        canActivate:[authGuard]
    },
    {
        path: '**', redirectTo:'login',
        pathMatch:'full'
    },
   

];
