import { DIALOG_DATA } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { FRONTEND_ENDPOINT } from '@app-shared/consts';
import { Product } from '@app-shared/interfaces';
import { UtilsService } from '@app-shared/services';
import { QrCodeModule } from 'ng-qrcode';

@Component({
  selector: 'app-generate-qr',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    QrCodeModule,
  ],
  template: `
    <h2 mat-dialog-title>Generated QR code</h2>
    <h4>{{ product.name }}</h4>
    <mat-dialog-content>
      <qr-code [value]="url" size="250"></qr-code>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Close</button>
      <button mat-button color="primary" (click)="download()">Download</button>
    </mat-dialog-actions>
  `,
  styles: `
    h4 {
      text-align: center;
      margin: 0px;
    }
    mat-dialog-content {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenerateQrComponent {
  private readonly utilsService = inject(UtilsService);
  readonly product: Product = inject(DIALOG_DATA);

  readonly url = `${FRONTEND_ENDPOINT}/scan/product/${this.product._id}`;

  download() {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (canvas) {
      this.utilsService.downloadCanvas(canvas, `${this.product.name}.qr_code`);
    }
  }
}
