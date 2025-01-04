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
}
