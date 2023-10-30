import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080';
  private authenticated = false;
  private token: string | null = null;
  private redirectUrl: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  login(loginData: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(`${this.apiUrl}/login`, loginData, { headers });
  }

  setRedirectUrl(url: string) {
    this.redirectUrl = url;
  }

  getAndClearRedirectUrl(): string | null {
    const url = this.redirectUrl;
    this.redirectUrl = null;
    return url;
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  setAuthenticated(value: boolean) {
    this.authenticated = value;
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  getAuthorizationHeader(contentType: string = 'application/json'): HttpHeaders {
    const token = this.getToken();
    if (token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': contentType
      });
    } else {
      return new HttpHeaders({
        'Content-Type': contentType
      });
    }
  }


  logout() {
    this.clearToken();
    this.setAuthenticated(false);
    this.router.navigate(['/login'])
  }

  isLoggedIn() {
    return this.isAuthenticated();  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      return currentTime > expirationTime;
    }
    return true;
  }

}

