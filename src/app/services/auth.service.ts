import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, switchMap, tap } from 'rxjs';
import { apiUrl } from '../../../config';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router,private http: HttpClient,private cookieService:CookieService) { }
  private accessTokenKey = 'accessToken';
  private refreshTokenKey = 'refreshToken';

  private loggedIn = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.loggedIn.asObservable();
  apiUrl=`${apiUrl.baseUrl}`

  // Login method: sends credentials to API and stores tokens
  login(data:any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}auth-user/auth`, data)
      // .pipe(
      //   tap((response:any) => {
      //     this.storeTokens(response.accessToken, response.refreshToken);
      //     this.loggedIn.next(true);
      //   })
      // );
  }

  // Refresh access token using the refresh token
   refreshAccessToken(): Observable<any> {
    const refreshToken = localStorage.getItem(this.refreshTokenKey);

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      return this.http
        .post<{ accessToken: string }>(`${this.apiUrl}/refresh`, { refreshToken })
        
      // Store the new access token and return it
      // this.storeAccessToken(response.accessToken);
      // return response.accessToken;
    } catch (error) {
      // Handle refresh token errors (e.g., expired or invalid refresh token)
      throw new Error('Failed to refresh access token');
    }
  
  }


  // Check if the user is authenticated (has valid access token)
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  // Store the tokens in localStorage or cookie
  private storeTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  // Store only access token (refresh token can be in HTTP-only cookie)
  private storeAccessToken(accessToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
  }

  // Get the access token from localStorage
  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  // Get the refresh token from localStorage
  private getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  // Logout the user by clearing the tokens
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId')
    localStorage.removeItem('designationId')
    localStorage.removeItem('roleId')
    localStorage.removeItem('status')
    localStorage.removeItem('name')
    this.cookieService.deleteAll()
    // localStorage.removeItem(this.refreshTokenKey);
    this.loggedIn.next(false);
    this.router.navigate(['/login'])
  }

  // Add JWT to request header for protected routes
  addAuthHeader(): HttpHeaders {
    const token = this.getAccessToken();
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

 

}
