import { Injectable, NgZone, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  NavigationEnd,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { LocalStorageKeys, UserRole } from '@app-shared/enums';
import { isPlatformBrowser } from '@angular/common';

import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, catchError, filter, of, tap } from 'rxjs';

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
  private readonly ngZone = inject(NgZone);
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

  get user() {
    return this.user$.value;
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
      this.ngZone.runOutsideAngular(() => {
        // ? Becouse of NG0506 (https://angular.io/errors/NG0506)
        setInterval(() => {
          this.checkUser();
        }, 300000);
      });
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
          this.user$.next(this.decodeToken(response.access_token));
          this.router.navigateByUrl('/');
        }),
      );
  }

  checkUser() {
    if (!this.isBrowser) {
      return;
    }

    if (!this.refreshToken || !this.accessToken) {
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
          this.router.navigateByUrl('/');
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

  logOut() {
    this.removeTokens();
    this.sweetAlert.displayToast('Log outed', 'success', 'green');
    this.user$.next(null);
  }

  removeTokens() {
    localStorage.removeItem(LocalStorageKeys.ACCESS_TOKEN);
    localStorage.removeItem(LocalStorageKeys.REFRESH_TOKEN);
  }

  canActivate() {
    if (this.isTokenExpired()) {
      this.router.navigateByUrl('/auth');
      return false;
    } else {
      return true;
    }
  }

  canAuth() {
    if (this.isBrowser) {
      const accessToken = this.accessToken;
      const refreshToken = this.refreshToken;
      if (accessToken || refreshToken) {
        if (!refreshToken || !accessToken) {
          this.removeTokens();
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    }
    return true;
  }

  canActivateAdmin() {
    const token = this.accessToken;
    if (this.isTokenExpired() || !token) {
      this.router.navigateByUrl('/auth');
      return false;
    } else {
      const decoded = this.decodeToken(token);
      if (decoded?.role === UserRole.Admin) {
        return true;
      } else {
        return false;
      }
    }
  }

  redirectGuard() {
    if (this.isBrowser) {
      return this.router.parseUrl('/auth');
    }
    return true;
  }
}

export const canActivate: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  return inject(AuthService).canActivate();
};

export const canActivateAdmin: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  return inject(AuthService).canActivateAdmin();
};

export const canAuth: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  return inject(AuthService).canAuth();
};
