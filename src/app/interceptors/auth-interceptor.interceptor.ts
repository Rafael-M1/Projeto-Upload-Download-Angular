import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  constructor(private loginService: LoginService, private router: Router) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let token = this.loginService.getToken();
    if (token && !isRequestLogin(req)) {
      if (this.loginService.isTokenExpired()) {
        this.router.navigate(['/login']);
        return EMPTY;
      } else {
        const authReq = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`),
        });
        return next.handle(authReq);
      }
    } else {
      return next.handle(req);
    }
  }
}
function isRequestLogin(req: HttpRequest<any>): boolean {
  if (req.method == 'POST' && req.url.includes('/oauth/token')) {
    return true;
  }
  return false;
}
