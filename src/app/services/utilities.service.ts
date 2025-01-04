import { Injectable } from '@angular/core';
import { apiUrl } from '../../../config';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { saveAs } from 'file-saver';
@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {
  private url=`${apiUrl.baseUrl}`
  constructor(private httpClient:HttpClient) { }

  private dataSource = new BehaviorSubject<any | null>(null);
  private dataSubject = new Subject<any>(); 
  // Observable to subscribe to data changes
  data1$=this.dataSubject.asObservable();
  data$ = this.dataSource.asObservable();

  // Method to change the data (can be called by any component)
  showModal(data: any) {
    this.dataSource.next(data);
  }
  getBrands():Observable<any>{
   return this.httpClient.get(`${this.url}utilities/brands`)
  }

  getLocations(data:any):Observable<any>{
    return this.httpClient.post(`${this.url}utilities/selected-locations`,data)
  }

  getDealers(data:any):Observable<any>{
    return this .httpClient.post(`${this.url}utilities/dealers`,data)
  }

  emitData(data: any): void {
    // console.log("data ",data);
    
    this.dataSubject.next(data);
  }

  exportExcel(data:any):Observable<any>{
    return this.httpClient.post(`${this.url}leadtime/export`,data,{ responseType: 'blob' })
  }

  exportFile(data: any) {
    this.exportExcel(data).subscribe(blob => {
      saveAs(blob, 'export.xlsx');  // Save the file with a custom name (e.g., 'export.xlsx')
    }, error => {
      console.error('Error exporting file:', error);
    });
  }

  getFileType(data:any):Observable<any>{
    return this.httpClient.post(`${this.url}leadtime/file-type`,data);
  }
}
