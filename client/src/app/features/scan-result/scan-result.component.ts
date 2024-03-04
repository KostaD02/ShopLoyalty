import { UserRole } from './../../shared/enums/role';
import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '@app-shared/interfaces';
import {
  AuthService,
  CartService,
  ProductService,
  SweetAlertService,
} from '@app-shared/services';

import { NgxCubeLoaderComponent } from 'ngx-cube-loader';
import { catchError, map, of, tap } from 'rxjs';
import { InfoComponent } from '../admin/ui';
import { DiscountPipe } from '@app-shared/pipes';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-scan-result',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    NgxCubeLoaderComponent,
    AsyncPipe,
    DiscountPipe,
  ],
  templateUrl: './scan-result.component.html',
  styleUrl: './scan-result.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ScanResultComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly productService = inject(ProductService);
  private readonly sweetAlertService = inject(SweetAlertService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly platform = inject(PLATFORM_ID);

  readonly isBrowser = isPlatformBrowser(this.platform);
  readonly userRole = UserRole;

  readonly user$ = this.authService.userStream$;
  readonly currentCartItem$ = this.cartService.cartStream$.pipe(
    map((cart) =>
      cart?.products.find(
        (item) => item._id === this.activatedRoute.snapshot.params['id'],
      ),
    ),
  );
  readonly currentProduct$ = this.productService
    .productById(this.activatedRoute.snapshot.params['id'])
    .pipe(
      catchError((error) => {
        this.sweetAlertService.displayError(error);
        return of(null);
      }),
    );

  ngOnInit() {
    if (this.isBrowser) {
      if (this.authService.isTokenExpired()) {
        this.router.navigate(['auth'], {
          queryParams: {
            redirectToItem: this.activatedRoute.snapshot.params['id'],
          },
        });
        this.sweetAlertService.displayToast(
          'You need to be authorized',
          'info',
          '#3f51b5',
        );
      }
    }
  }

  addToCart(product: Product) {
    if (
      this.cartService.cart?.products.some((item) => item._id === product._id)
    ) {
      this.sweetAlertService.displayToast(
        'Product is already in cart',
        'info',
        '#3f51b5',
      );
      return;
    }

    this.cartService
      .updateSingleProduct({ _id: product._id, count: 1 })
      .pipe(
        tap((result) => {
          if (result) {
            this.sweetAlertService.displayToast(
              'Product added to cart',
              'success',
              'green',
            );
          }
        }),
      )
      .subscribe();
  }

  showInfo(product: Product) {
    this.dialog.open(InfoComponent, { data: product, autoFocus: false });
  }

  editInfo(product: Product) {
    this.router.navigate(['admin'], { queryParams: { search: product.name } });
  }
}
