import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CookiesService } from '../../services/cookies.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor{

  constructor(private cookieService:CookiesService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.cookieService.getCookie('refreshToken');
    console.log(authToken)
    // If the cookie exists, modify the request to add the Authorization header
    if (authToken) {
      const clonedRequest = req.clone({
        setHeaders: {
          'Authorization': `Bearer ${authToken}`  // Add the token to Authorization header
        }
      });

      // Pass the cloned request to the next handler
      return next.handle(clonedRequest);

    }
    // If no cookie found, proceed with the original request
    return next.handle(req);
  }
}
