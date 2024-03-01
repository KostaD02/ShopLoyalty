import { DIALOG_DATA } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { Product } from '@app-shared/interfaces';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ product.name }}</h2>
    <mat-dialog-content>
      <img [src]="product.imageSrc" [alt]="product.name + 'image'" />
      <mat-list role="list">
        <div mat-subheader>General</div>
        <mat-list-item role="listitem">
          Price: {{ product.price }}
        </mat-list-item>
        <mat-list-item role="listitem"
          >Unique id: {{ product._id }}
        </mat-list-item>
        <mat-divider></mat-divider>
        <div mat-subheader>Discounts</div>
        @for (
          discount of product.productDiscount;
          track discount.discountPercentage
        ) {
          <mat-list-item role="listitem">
            <span>
              Range: [{{ discount.range[0] }}, {{ discount.range[1] }}]
            </span>
            <span>| Discount: {{ discount.discountPercentage }} %</span>
          </mat-list-item>
        }
      </mat-list>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: `
    img {
      height: 200px;
      object-fit: contain;
    }
    mat-list {
      max-width: 400px;
    }
    mat-dialog-content {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
      place-items: center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoComponent {
  readonly product: Product = inject(DIALOG_DATA);
}
