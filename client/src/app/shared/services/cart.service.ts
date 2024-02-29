import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { BACKEND_ENDPOINT } from '@app-shared/consts';
import { SweetAlertService } from './sweet-alert.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly sweetAlert = inject(SweetAlertService);
  private readonly platform = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platform);
  private readonly BACKEND_ENDPOINT = BACKEND_ENDPOINT;

  private readonly cart$ = new BehaviorSubject<null>(null); // UPDATE IT
}
