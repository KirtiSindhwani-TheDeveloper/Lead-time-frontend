import { Routes } from '@angular/router';
import { CreateMappingComponent } from './mapping-master/create-mapping/create-mapping.component';
import { CreateComponent } from './upload/create/create.component';
import { CreateUserComponent } from './user-management/create-user/create-user.component';
import { CreateExportComponent } from './export/create-export/create-export.component';
import { LoginComponent } from './core/login/login.component';
import { ViewUserComponent } from './user-management/view-user/view-user.component';


export const routes: Routes = [
    {
        path:'create',component:CreateMappingComponent
      },
      {
        path: 'app-upload',
        component: CreateComponent
    },
    {
        path: 'app-export',
        component: CreateExportComponent

    },
    {
        path: '', redirectTo:'login',
        pathMatch:'full'
    },
    {
        path: 'user',
        component: CreateUserComponent
    },
    {
        path:'login',
        component:LoginComponent
    },
    {
        path:'view-user',
        component:ViewUserComponent
    }

];
