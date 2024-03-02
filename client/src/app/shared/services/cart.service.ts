import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, of, tap } from 'rxjs';
import { BACKEND_ENDPOINT } from '@app-shared/consts';
import { Cart, CartCheckout, CartProduct } from '@app-shared/interfaces';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly httpClient = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly platform = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platform);
  private readonly BACKEND_ENDPOINT = BACKEND_ENDPOINT;

  private readonly cart$ = new BehaviorSubject<Cart | null>(null);
  readonly cartStream$ = this.cart$.asObservable();

  constructor() {
    this.init();
  }

  init() {
    if (this.isBrowser) {
      this.authService.userStream$
        .pipe(
          tap((user) => {
            if (user) {
              this.handleCurrentCart();
            } else {
              this.cart$.next(null);
            }
          }),
        )
        .subscribe();
    }
  }

  getCurrentCart() {
    return this.httpClient.get<Cart>(`${this.BACKEND_ENDPOINT}/cart`);
  }

  addSingleProduct(cartProduct: CartProduct) {
    return this.httpClient.patch<Cart>(
      `${this.BACKEND_ENDPOINT}/cart`,
      cartProduct,
    );
  }

  checkout() {
    return this.httpClient.post<CartCheckout>(
      `${this.BACKEND_ENDPOINT}/cart/checkout`,
      {},
    );
  }

  removeSingleItem(id: string) {
    return this.httpClient.delete<Cart>(
      `${this.BACKEND_ENDPOINT}/cart/id/${id}`,
    );
  }

  clearCart() {
    return this.httpClient.delete<Cart>(`${this.BACKEND_ENDPOINT}/cart/clear`);
  }

  handleCurrentCart() {
    if (!this.authService.user) {
      return;
    }
    this.getCurrentCart()
      .pipe(
        tap((cart) => {
          this.cart$.next(cart);
          console.log(cart);
        }),
        catchError(() => {
          this.cart$.next(null);
          return of(false);
        }),
      )
      .subscribe();
  }
}
