import { DialogRef } from '@angular/cdk/dialog';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { CartProducts } from '@app-shared/interfaces';
import { DiscountPipe } from '@app-shared/pipes';
import { CartService, SweetAlertService } from '@app-shared/services';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatIconModule,
    MatDivider,
    AsyncPipe,
    DiscountPipe,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartComponent {
  private readonly cartService = inject(CartService);
  private readonly sweetAlertService = inject(SweetAlertService);
  private readonly dialogRef = inject(DialogRef);
  readonly cart$ = this.cartService.cartStream$;

  disableButton = false;

  removeItemFromCart(id: string) {
    this.disableButton = true;
    this.cartService.removeSingleItem(id).subscribe(() => {
      this.disableButton = false;
    });
  }

  decrementProductCart(product: CartProducts) {
    this.disableButton = true;
    const count = product.count - 1;
    if (count <= 0) {
      this.removeItemFromCart(product._id);
    } else {
      this.cartService
        .updateSingleProduct({
          ...product,
          count: product.count - 1,
        })
        .subscribe(() => {
          this.disableButton = false;
        });
    }
  }

  incrementProductCart(product: CartProducts) {
    this.disableButton = true;
    this.cartService
      .updateSingleProduct({
        ...product,
        count: product.count + 1,
      })
      .subscribe(() => {
        this.disableButton = false;
      });
  }

  checkout() {
    this.cartService
      .checkout()
      .pipe(
        tap((result) => {
          this.sweetAlertService.displayModal(
            'success',
            'Payed',
            `Your total was ${result.total} ₾`,
          );
          this.dialogRef.close();
        }),
        catchError((error) => {
          this.sweetAlertService.displayError(error);
          return of(false);
        }),
      )
      .subscribe();
  }
}
