import { DIALOG_DATA } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';
import { Product } from '@app-shared/interfaces';
import { ProductService, SweetAlertService } from '@app-shared/services';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-delete-product',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>Do you want delete ?</h2>
    <mat-dialog-content>
      <p>Are you sure to delete "{{ product.name }}" ?</p>
      <p>You won't be able to revert this!</p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button color="warn" (click)="deleteProduct()">Delete</button>
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: `
    mat-dialog-actions {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 5px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteProductComponent {
  readonly product: Product = inject(DIALOG_DATA);
  private readonly productService = inject(ProductService);
  private readonly sweetAlertService = inject(SweetAlertService);
  private readonly dialogRef = inject(MatDialogRef);

  deleteProduct() {
    this.productService
      .deleteProduct(this.product._id)
      .pipe(
        tap(() => {
          this.sweetAlertService.displayToast(
            'Product deleted',
            'success',
            'green',
          );
          this.dialogRef.close(true);
        }),
        catchError((error) => {
          this.sweetAlertService.displayError(error);
          return of(false);
        }),
      )
      .subscribe();
  }
}
