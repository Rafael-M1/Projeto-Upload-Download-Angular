import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginForm } from '../model/login-form';
import { AuthObject } from '../model/auth-object';
import { JwtDecodeService } from './jwt-decode.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl: string = environment.apiUrl;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  constructor(
    private http: HttpClient,
    private jwtDecodeService: JwtDecodeService
  ) {
    const token = localStorage.getItem('token');
    if (token) {
      this.isAuthenticatedSubject.next(true);
    }
  }

  logar(loginForm: LoginForm): Observable<AuthObject> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic YW5ndWxhcjpAbmd1bEByMA==',
    });
    const body = new HttpParams()
      .set('grant_type', 'password')
      .set('username', loginForm.username)
      .set('password', loginForm.password)
      .set('client', 'angular');
    return this.http.post<AuthObject>(
      `${this.apiUrl}/oauth/token`,
      body.toString(),
      {
        headers: headers,
      }
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isTokenExpired() {
    let token = this.getToken();
    if (token) {
      const decodedToken = this.jwtDecodeService.decodeToken(token);
      if (decodedToken) {
        const tokenDate = new Date(decodedToken.exp);
        return !(tokenDate > new Date());
      }
      //Token is expired;
      return true;
    }
    //Token is expired;
    return true;
  }

  isUserAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  setIsAuthenticatedSubject(value: boolean) {
    this.isAuthenticatedSubject.next(value);
  }
}
