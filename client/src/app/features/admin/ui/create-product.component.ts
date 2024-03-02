import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DEFAULT_IMAGE_URL } from '@app-shared/consts';
import { Product } from '@app-shared/interfaces';
import { ProductService, SweetAlertService } from '@app-shared/services';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  template: `
    <h2 mat-dialog-title>Generate QR code</h2>
    <mat-dialog-content>
      <form [formGroup]="productForm">
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input
            type="text"
            matInput
            placeholder="Product name"
            formControlName="name"
          />
          @if (getProductFormValue('name', 'required')) {
            <mat-error> Name required </mat-error>
          }
          @if (getProductFormValue('name', 'minlength')) {
            <mat-error> Minimum 2 char </mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Price</mat-label>
          <input
            type="number"
            matInput
            placeholder="Product price"
            formControlName="price"
          />
          <span matTextSuffix>₾&nbsp;</span>
          @if (getProductFormValue('price', 'required')) {
            <mat-error> Name required </mat-error>
          }
          @if (getProductFormValue('price', 'min')) {
            <mat-error> Minimum 1 </mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Image URL</mat-label>
          <input
            type="text"
            matInput
            placeholder="Product image src"
            formControlName="imageSrc"
          />
          @if (getProductFormValue('imageSrc', 'required')) {
            <mat-error> image source is required </mat-error>
          }
          @if (getProductFormValue('imageSrc', 'pattern')) {
            <mat-error> Incorrect url </mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Textarea</mat-label>
          <textarea
            matInput
            formControlName="description"
            placeholder="Product description"
          >
          </textarea>
          @if (getProductFormValue('description', 'required')) {
            <mat-error> Description required </mat-error>
          }
          @if (getProductFormValue('description', 'minlength')) {
            <mat-error> Minimum 2 char </mat-error>
          }
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button
        mat-button
        color="primary"
        (click)="create()"
        [disabled]="!productForm.valid"
      >
        Create
      </button>
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: `
    mat-dialog-content {
      min-width: 250px;
      form {
        padding: 10px 0;
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
        place-items: center;

        mat-form-field {
          width: 100%;
        }
      }
    }
    mat-dialog-actions {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 5px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateProductComponent {
  private readonly productService = inject(ProductService);
  private readonly sweetAlertService = inject(SweetAlertService);
  private readonly dialogRef = inject(MatDialogRef);
  readonly productForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    price: new FormControl(0, [Validators.required, Validators.min(1)]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    imageSrc: new FormControl('', [
      Validators.required,
      Validators.pattern('^(https?://).*$'),
    ]),
  });

  async create() {
    const product = this.productForm.value as Omit<Product, '_id'>;
    product.productDiscount = [];
    await fetch(product.imageSrc).catch((err) => {
      product.imageSrc = DEFAULT_IMAGE_URL;
    });
    this.productService
      .createProduct(product)
      .pipe(
        tap((result) => {
          this.sweetAlertService.displayToast('Created', 'success', 'green');
          this.dialogRef.close(result);
        }),
        catchError((error) => {
          this.sweetAlertService.displayError(error);
          return of(false);
        }),
      )
      .subscribe();
  }

  getProductFormValue(control: string, part: string) {
    return (this.productForm.get(control)?.errors || {})[part] || false;
  }
}
