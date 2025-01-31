import { Injectable } from '@angular/core';
import { apiUrl } from '../../../config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url=`${apiUrl.baseUrl}`
  constructor(private http:HttpClient) { }

  getUsers():Observable<any>{
    return this.http.get(`${this.url}user/get-user`)
  }

  createUser(data:any):Observable<any>{
    return this.http.post(`${this.url}user/create-user`,data)
  }

  viewUser():Observable<any>{
    return this.http.get(`${this.url}user/view-user`);
  }
}
