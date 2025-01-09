import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { CookiesService } from '../../services/cookies.service';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor{

  constructor(private cookieService:CookiesService,private authService:AuthService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  const accessToken = this.authService.getAccessToken();

  // Clone the request to add the Authorization header if access token is available
  let clonedRequest = req;
  if (accessToken) {
    clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  return next.handle(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      // If a 401 error occurs (access token expired), refresh the token
      if (error.status === 401) {
        return this.authService.refreshAccessToken().pipe(
          switchMap((newToken) => {
            // Clone the original request with the new access token
            clonedRequest = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`
              }
            });

            // Retry the original request with the new token
            return next.handle(clonedRequest);
          }),
          catchError((refreshError) => {
            // Handle any error in refreshing the token (e.g., refresh token expired)
            return throwError(refreshError);
          })
        );
      }

      // If the error is not 401, rethrow the original error
      return throwError(error);
    })
  );
}
}
