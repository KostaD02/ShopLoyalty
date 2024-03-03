import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, catchError, of, tap } from 'rxjs';
import { BACKEND_ENDPOINT } from '@app-shared/consts';
import { Cart, CartCheckout, CartProduct } from '@app-shared/interfaces';
import { AuthService } from './auth.service';
import { SweetAlertService } from './sweet-alert.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly httpClient = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly sweetAlertService = inject(SweetAlertService);
  private readonly platform = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platform);
  private readonly BACKEND_ENDPOINT = BACKEND_ENDPOINT;

  private readonly cart$ = new BehaviorSubject<Cart | null>(null);
  readonly cartStream$ = this.cart$.asObservable();

  get cart() {
    return this.cart$.value;
  }

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

  updateSingleProduct(cartProduct: CartProduct) {
    return this.httpClient
      .patch<Cart>(`${this.BACKEND_ENDPOINT}/cart`, cartProduct)
      .pipe(
        tap((cart) => {
          this.cart$.next(cart);
        }),
        catchError((error) => {
          this.sweetAlertService.displayError(error);
          return of(false);
        }),
      );
  }

  checkout() {
    return this.httpClient
      .post<CartCheckout>(`${this.BACKEND_ENDPOINT}/cart/checkout`, {})
      .pipe(
        tap((cart) => {
          if (cart) {
            this.cart$.next(cart.currentCart);
          }
        }),
      );
  }

  removeSingleItem(id: string) {
    return this.httpClient
      .delete<Cart>(`${this.BACKEND_ENDPOINT}/cart/id/${id}`)
      .pipe(
        tap((cart) => {
          this.cart$.next(cart);
        }),
        catchError((error) => {
          this.sweetAlertService.displayError(error);
          return of(false);
        }),
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
        }),
        catchError(() => {
          this.cart$.next(null);
          return of(false);
        }),
      )
      .subscribe();
  }
}
