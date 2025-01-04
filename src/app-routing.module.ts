import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  { path: 'mapping',  
    loadChildren: () => import('../src/app/mapping-master/mapping-master.module').then(m => m.MappingMasterModule) },
    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
