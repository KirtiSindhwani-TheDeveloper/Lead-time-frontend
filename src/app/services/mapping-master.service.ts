import { Injectable } from '@angular/core';
import { apiUrl } from '../../../config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MappingMasterService {
 private url=`${apiUrl.baseUrl}`
  constructor(private http:HttpClient) { }

  uploadFile(data:any):Observable<any>{
    return this.http.post(`${this.url}mapping/upload`,data)
  }

  addColumns(data:any):Observable<any>{
    return this.http.post(`${this.url}leadtime/add-column`,data)
  }

  editColumns(data:any):Observable<any>{
    return this.http.post(`${this.url}leadtime/edit-column`,data)
  }

  fetchData(data:any):Observable<any>{
    return this.http.post(`${this.url}leadtime/fetch`,data)
  }

  readSubHeaderColumns(data:any):Observable<any>{
    return this.http.post(`${this.url}leadtime/read-sub-header`,data);
  }

  mappingExist(data:any):Observable<any>{
    return this.http.post(`${this.url}leadtime/mapping-exist`,data)
  }
}
