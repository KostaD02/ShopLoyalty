import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavigationEnd, Router } from '@angular/router';
import { LocalStorageKeys } from '@app-shared/enums';
import { isPlatformBrowser } from '@angular/common';

import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, catchError, filter, of, take, tap } from 'rxjs';

import { BACKEND_ENDPOINT } from '@app-shared/consts';
import { JwtResponse, User } from '@app-shared/interfaces';
import { SweetAlertService } from './sweet-alert.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly sweetAlert = inject(SweetAlertService);
  private readonly jwtHelperSerivce = inject(JwtHelperService);
  private readonly platform = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platform);
  private readonly BACKEND_ENDPOINT = BACKEND_ENDPOINT;

  private readonly user$ = new BehaviorSubject<User | null>(null);
  readonly userStream$ = this.user$.asObservable();

  get accessToken(): string | null {
    return localStorage.getItem(LocalStorageKeys.ACCESS_TOKEN);
  }

  get refreshToken(): string | null {
    return localStorage.getItem(LocalStorageKeys.REFRESH_TOKEN);
  }

  constructor() {
    this.init();
  }

  init() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        tap(() => {
          this.checkUser();
        }),
      )
      .subscribe();
    if (this.isBrowser) {
      setInterval(() => {
        this.checkUser();
      }, 300000);
    }
  }

  signUp(name: string, lastName: string, email: string, password: string) {
    return this.httpClient.post<User>(`${this.BACKEND_ENDPOINT}/auth/sign_up`, {
      name,
      lastName,
      email,
      password,
    });
  }

  signIn(email: string, password: string) {
    return this.httpClient
      .post<JwtResponse>(`${this.BACKEND_ENDPOINT}/auth/sign_in`, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          this.sweetAlert.displayToast('Authorized', 'success', 'green');
          localStorage.setItem(
            LocalStorageKeys.ACCESS_TOKEN,
            response.access_token,
          );
          localStorage.setItem(
            LocalStorageKeys.REFRESH_TOKEN,
            response.refresh_token,
          );
          this.router.navigateByUrl('/');
        }),
      );
  }

  checkUser() {
    if (!this.isBrowser) {
      return;
    }

    if (!this.refreshToken) {
      this.removeTokens();
      return;
    }

    if (
      (!this.accessToken && this.refreshToken) ||
      (this.isTokenExpired() && this.refreshToken)
    ) {
      this.updateToken();
      return;
    }

    this.getCurrentUser()
      .pipe(
        tap((user) => {
          this.user$.next(user);
        }),
        catchError((err) => {
          this.removeTokens();
          return of(false);
        }),
      )
      .subscribe();
  }

  updateToken() {
    this.httpClient
      .post<Omit<JwtResponse, 'refresh_token'>>(
        `${this.BACKEND_ENDPOINT}/auth/refresh`,
        {},
        {
          headers: {
            refresh_token:
              localStorage.getItem(LocalStorageKeys.REFRESH_TOKEN) || '',
          },
        },
      )
      .pipe(
        tap((response) => {
          localStorage.setItem(
            LocalStorageKeys.ACCESS_TOKEN,
            response.access_token,
          );
        }),
        catchError((err) => {
          if (err) {
            this.removeTokens();
          }
          return of(false);
        }),
      )
      .subscribe();
  }

  getCurrentUser() {
    return this.httpClient.get<User>(`${this.BACKEND_ENDPOINT}/auth`);
  }

  isTokenExpired() {
    return this.jwtHelperSerivce.isTokenExpired();
  }

  decodeToken(token: string): User | null {
    return this.jwtHelperSerivce.decodeToken(token);
  }

  removeTokens() {
    localStorage.removeItem(LocalStorageKeys.ACCESS_TOKEN);
    localStorage.removeItem(LocalStorageKeys.REFRESH_TOKEN);
  }
}
