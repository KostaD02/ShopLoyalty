import { DIALOG_DATA } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
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
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { Product, ProductDiscount } from '@app-shared/interfaces';
import { ProductService, SweetAlertService } from '@app-shared/services';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title>Edit: "{{ product.name }}"</h2>
    <mat-dialog-content>
      <mat-tab-group dynamicHeight>
        <mat-tab label="Edit general data">
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
            <div class="right">
              <button
                mat-button
                color="primary"
                (click)="update()"
                [disabled]="!productForm.valid || !productForm.touched"
              >
                Update
              </button>
            </div>
          </form>
        </mat-tab>
        <mat-tab label="Edit Discounts">
          <div class="wrap">
            <div class="actions">
              <button mat-raised-button color="primary" (click)="addDiscount()">
                Add discount
              </button>
              <button
                mat-raised-button
                color="warn"
                [disabled]="
                  !discounts.valid ||
                  !discounts.touched ||
                  discounts.controls.length < 1
                "
                (click)="updateDiscounts()"
              >
                Update discounts
              </button>
            </div>
            <form [formGroup]="discountsForm">
              <div formArrayName="discounts">
                @for (discount of discounts.controls; track discount) {
                  <div class="discount" [formGroupName]="$index">
                    <div class="head">
                      <p>#{{ $index + 1 }} Discount</p>
                      <button
                        mat-icon-button
                        color="warn"
                        (click)="deleteDiscount($index)"
                      >
                        <mat-icon>delete</mat-icon>
                      </button>
                    </div>
                    <div class="body">
                      <mat-form-field appearance="outline">
                        <mat-label>Range 1</mat-label>
                        <input
                          type="number"
                          matInput
                          placeholder="Product price"
                          formControlName="range1"
                        />
                        @if (
                          getDiscountFormValue('range1', 'required', $index)
                        ) {
                          <mat-error>
                            First value of range is required
                          </mat-error>
                        }
                        @if (getDiscountFormValue('range1', 'min', $index)) {
                          <mat-error> Minimum 1 </mat-error>
                        }
                      </mat-form-field>
                      <mat-form-field appearance="outline">
                        <mat-label>Range 2</mat-label>
                        <input
                          type="number"
                          matInput
                          placeholder="Product price"
                          formControlName="range2"
                        />
                        @if (
                          getDiscountFormValue('range2', 'required', $index)
                        ) {
                          <mat-error>
                            Second value of range is required
                          </mat-error>
                        }
                        @if (getDiscountFormValue('range2', 'min', $index)) {
                          <mat-error> Minimum 1 </mat-error>
                        } @else if (
                          getDiscountFormValue('range2', 'matchError', $index)
                        ) {
                          <mat-error>
                            Range 2 should be more than Range 1
                          </mat-error>
                        }
                      </mat-form-field>
                      <mat-form-field appearance="outline">
                        <mat-label>Discount</mat-label>
                        <input
                          type="number"
                          matInput
                          placeholder="Product price"
                          formControlName="discount"
                        />
                        <span matTextSuffix>%&nbsp;</span>
                        @if (
                          getDiscountFormValue('discount', 'required', $index)
                        ) {
                          <mat-error> Discount is required </mat-error>
                        }
                        @if (getDiscountFormValue('discount', 'min', $index)) {
                          <mat-error> Minimum 1 </mat-error>
                        }
                        @if (getDiscountFormValue('discount', 'max', $index)) {
                          <mat-error> Maximum 100 </mat-error>
                        }
                      </mat-form-field>
                    </div>
                  </div>
                }
              </div>
            </form>
          </div>
        </mat-tab>
      </mat-tab-group>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: `
    mat-dialog-content {
      min-width: 250px;
      form,
      .wrap {
        width: 100%;
        margin: 10px 0 0;
        padding: 10px 0;
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
        place-items: center;

        div {
          width: 100%;

          &.discount {
            width: 90%;
            margin: auto;
          }

          &.right {
            display: flex;
            justify-content: flex-end;
            align-items: center;
          }

          &.head {
            display: flex;
            justify-content: flex-start;
            align-items: center;

            p {
              margin: 0;
            }
          }
        }

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

    .actions {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      padding: 10px 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditComponent implements OnInit {
  private readonly sweetAlertService = inject(SweetAlertService);
  private readonly productService = inject(ProductService);
  private readonly dialogRef = inject(MatDialogRef);
  private readonly fb = inject(FormBuilder);
  readonly product: Product = inject(DIALOG_DATA);

  readonly productForm = new FormGroup({
    name: new FormControl(this.product.name, [
      Validators.required,
      Validators.minLength(2),
    ]),
    price: new FormControl(this.product.price, [
      Validators.required,
      Validators.min(1),
    ]),
    description: new FormControl(this.product.description, [
      Validators.required,
      Validators.minLength(2),
    ]),
    imageSrc: new FormControl(this.product.imageSrc, [
      Validators.required,
      Validators.pattern('^(https?://).*$'),
    ]),
  });

  readonly discountsForm = this.fb.group({
    discounts: this.fb.array([]),
  });

  get discounts() {
    return this.discountsForm.get('discounts') as FormArray;
  }

  ngOnInit(): void {
    this.product.productDiscount.forEach((product) => {
      this.addDiscount(
        product.range[0],
        product.range[1],
        product.discountPercentage,
      );
    });
  }

  addDiscount(range1 = 0, range2 = 1, discount = 1) {
    this.discounts.push(
      this.fb.group({
        range1: [range1, [Validators.required, Validators.min(0)]],
        range2: [
          range2,
          [Validators.required, Validators.min(1), this.rangeValidator],
        ],
        discount: [
          discount,
          [Validators.required, Validators.min(1), Validators.max(100)],
        ],
      }),
    );
  }

  deleteDiscount(index: number) {
    this.discounts.removeAt(index);
  }

  private rangeValidator(control: AbstractControl) {
    if (!control.parent) return;
    if (control.value <= (control.parent.get('range1') || {}).value) {
      return { matchError: true };
    }
    return null;
  }

  update() {
    const product = this.productForm.value as Omit<Product, '_id'>;
    if (
      product.name === this.product.name &&
      product.price === this.product.price &&
      product.imageSrc === this.product.imageSrc &&
      product.description === this.product.description
    ) {
      this.sweetAlertService.displayToast(
        'Nothing to update',
        'info',
        '#3f51b5',
      );
      this.dialogRef.close();
      return;
    }

    this.productService
      .updateProduct({ ...product, _id: this.product._id })
      .pipe(
        tap((updatedProduct) => {
          this.sweetAlertService.displayToast(
            'Product updated',
            'success',
            'green',
          );
          this.dialogRef.close(updatedProduct);
        }),
        catchError((error) => {
          this.sweetAlertService.displayError(error);
          return of(false);
        }),
      )
      .subscribe();
  }

  updateDiscounts() {
    const productDiscount: ProductDiscount[] = this.discounts.value.map(
      (item: { discount: number; range1: number; range2: number }) => ({
        range: [item.range1, item.range2],
        discountPercentage: item.discount,
      }),
    );

    const isSame = this.product.productDiscount.every((product) => {
      return productDiscount.some((innerProduct) => {
        return (
          product.range[0] === innerProduct.range[0] &&
          product.range[1] === innerProduct.range[1] &&
          product.discountPercentage === innerProduct.discountPercentage
        );
      });
    });

    // TODO: fix detect change
    // if (isSame) {
    //   this.sweetAlertService.displayToast('Nothing changed', 'error', 'red');
    //   this.dialogRef.close();
    //   return;
    // }

    const products = productDiscount.sort((a, b) => a.range[0] - b.range[0]);

    for (let i = 1; i < products.length; i++) {
      const prevItem = products[i - 1];
      const currentItem = products[i];

      if (prevItem.range[1] >= currentItem.range[0]) {
        this.sweetAlertService.displayToast(
          'Overlap detected in ranges',
          'error',
          'red',
        );
        return;
      }

      if (prevItem.discountPercentage > currentItem.discountPercentage) {
        this.sweetAlertService.displayToast(
          'Discount percentage is greater in lower range',
          'error',
          'red',
        );
        return;
      }
    }

    this.productService
      .updateDiscount({
        _id: this.product._id,
        productDiscount: products,
      })
      .pipe(
        tap((updatedProduct) => {
          this.sweetAlertService.displayToast(
            'Product discount updated',
            'success',
            'green',
          );
          this.dialogRef.close(updatedProduct);
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

  getDiscountFormValue(control: string, part: string, index: number) {
    return (
      (this.discountsForm.controls.discounts.controls[index].get(control)
        ?.errors || {})[part] || false
    );
  }
}
