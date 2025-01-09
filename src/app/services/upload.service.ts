import { Injectable } from '@angular/core';
import { apiUrl } from '../../../config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private url=`${apiUrl.baseUrl}`
  constructor(private http:HttpClient) { }

  getUploadedDetails(data:any):Observable<any>{
    return this.http.post(`${this.url}leadtime/uploaded-data`,data)
  }

  uploadData(data:any):Observable<any>{
    return this.http.post(`${this.url}leadtime/upload`,data)
  }

  uploadLogs(data:any):Observable<any>{
    return this.http.post(`${this.url}leadtime/uploaded-logs`,data)
  }

  deleteUploadedData(data:any):Observable<any>{
    return this.http.post(`${this.url}leadtime/delete-uploaded-data`,data);
  }

 
}
