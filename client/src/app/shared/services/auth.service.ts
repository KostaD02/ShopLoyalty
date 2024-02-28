import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BACKEND_ENDPOINT } from '@app-shared/consts';
import { JwtResponse, User } from '@app-shared/interfaces';
import { BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LocalStorageKeys } from '@app-shared/enums';
import { SweetAlertService } from './sweet-alert.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly sweetAlert = inject(SweetAlertService);
  private readonly BACKEND_ENDPOINT = BACKEND_ENDPOINT;

  private readonly user$ = new BehaviorSubject<User | null>(null);
  readonly userStream$ = this.user$.asObservable();

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
}
