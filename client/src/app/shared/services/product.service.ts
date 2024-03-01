import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { BACKEND_ENDPOINT } from '@app-shared/consts';
import { SweetAlertService } from './sweet-alert.service';
import { BehaviorSubject } from 'rxjs';
import { Product, ProductDiscount } from '@app-shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly httpClient = inject(HttpClient);
  private readonly BACKEND_ENDPOINT = BACKEND_ENDPOINT;

  getAllProducts() {
    return this.httpClient.get<Product[]>(
      `${this.BACKEND_ENDPOINT}/product/all`,
    );
  }

  productById(id: string) {
    return this.httpClient.get<Product>(
      `${this.BACKEND_ENDPOINT}/product/id/${id}`,
    );
  }

  createProduct(product: Omit<Product, '_id'>) {
    return this.httpClient.post<Product>(
      `${this.BACKEND_ENDPOINT}/product/create`,
      product,
    );
  }

  updateProduct(product: Omit<Product, '_id' | 'productDiscount'>) {
    return this.httpClient.patch<Product>(
      `${this.BACKEND_ENDPOINT}/product/update`,
      product,
    );
  }

  updateDiscount(product: Pick<Product, '_id' | 'productDiscount'>) {
    return this.httpClient.patch<Product>(
      `${this.BACKEND_ENDPOINT}/product/update_discount`,
      product,
    );
  }

  deleteProduct(id: string) {
    return this.httpClient.delete<{ acknowledged: boolean }>(
      `${this.BACKEND_ENDPOINT}/product/delete/id/${id}`,
    );
  }
}
