import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { BACKEND_ENDPOINT } from '@app-shared/consts';
import { SweetAlertService } from './sweet-alert.service';
import { BehaviorSubject } from 'rxjs';
import { Product } from '@app-shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly sweetAlert = inject(SweetAlertService);
  private readonly platform = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platform);
  private readonly BACKEND_ENDPOINT = BACKEND_ENDPOINT;

  getAllProducts() {
    return this.httpClient.get<Product[]>(
      `${this.BACKEND_ENDPOINT}/product/all`,
    );
  }
}
