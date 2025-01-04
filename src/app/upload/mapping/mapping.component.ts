import { Component, Inject } from '@angular/core';
import { PrimengModule } from '../../shared/primeng/primeng.module';
import { SharedModule } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-mapping',
  imports: [PrimengModule,SharedModule,CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './mapping.component.html',
  styleUrl: './mapping.component.css'
})
export class MappingComponent {
  mappedData:any[]=[];
  updatedData:any[]=[]
 brands:any[]=[];
  constructor(@Inject(DynamicDialogConfig) private config: DynamicDialogConfig,
  public ref: DynamicDialogRef ){
    this.mappedData=config.data.data;
    this.brands=config.data.brands;
  
  }

 ngOnInit(){
  this.updatedData = this.bindBrandName(this.mappedData, this.brands);
  console.log("this.mapped data ",this.updatedData,this.brands)
 }

  bindBrandName = (data:any, brandMapping:any) => {
    console.log("brand mapping",brandMapping)
  return data.map((item:any) => {
    const brand = brandMapping.find((brand :any)=> brand.brand_id === item.brand_id);
    return {
      ...item,
      brand_name: brand.brand  || "Unknown Brand" // Default if no match
    };
  });
};
 close() {
  this.ref.close();
}

ngOnDestroy() {
  if (this.ref) {
      this.ref.close();
  }
}
closeDialog(data:any) {

  this.ref.close(data);
}
onSubmit(data:any){

}
}
