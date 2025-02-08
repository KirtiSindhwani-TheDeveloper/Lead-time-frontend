import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../../../config';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RoleBasedService {

  private apiUrl:any=apiUrl.baseUrl
  constructor(private http:HttpClient
  ) { }


  createRole(data:any):Observable<any>{
    return this.http.post(`${this.apiUrl}roles/create`,data)
  }

  viewRole():Observable<any>{
    return this.http.get(`${this.apiUrl}roles/view`)
  }

  editRole(data:any):Observable<any>{
    return this.http.post(`${this.apiUrl}roles/edit`,data)
  }

  deleteRole(data:any):Observable<any>{
    return this.http.post(`${this.apiUrl}roles/delete`,data)
  }

  downloadRoleFormat():Observable<any>{
    return this.http.get(`${this.apiUrl}roles/download-role-format`)
  }

  getModules():Observable<any>{
    return this.http.get(`${this.apiUrl}sidebar/module`)
  }

  getModulesBasedOnBVID(data:any):Observable<any>{
    return this.http.post(`${this.apiUrl}roles/access-setting-on-BVID`,data);
  }
}
