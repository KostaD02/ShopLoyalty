import { DIALOG_DATA } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Product, ProductWithUrl } from '@app-shared/interfaces';
import { QrCodeModule } from 'ng-qrcode';
import { MatSelectModule } from '@angular/material/select';
import { UtilsService } from '@app-shared/services';

@Component({
  selector: 'app-generate-qr-all',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    QrCodeModule,
  ],
  template: `
    <h2 mat-dialog-title>Generate QR code</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline">
        <mat-label>Pick Item</mat-label>
        <mat-select [(value)]="selected">
          @for (product of products; track product) {
            <mat-option
              (click)="selectedProduct = product"
              [value]="product.productUrl"
            >
              {{ product.name }}</mat-option
            >
          }
        </mat-select>
      </mat-form-field>
      <qr-code [value]="selected" size="250"></qr-code>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button color="primary" (click)="download()">Download</button>
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: `
    mat-dialog-content {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
      place-items: center;

      mat-form-field {
        padding: 10px 0 0;
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
export class GenerateQrAllComponent {
  private readonly utilsService = inject(UtilsService);
  readonly products: ProductWithUrl[] = inject(DIALOG_DATA);

  selected = '';
  selectedProduct: ProductWithUrl | null = null;

  download() {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (canvas && this.selectedProduct) {
      this.utilsService.downloadCanvas(
        canvas,
        `${this.selectedProduct.name}.qr_code`,
      );
    }
  }
}
