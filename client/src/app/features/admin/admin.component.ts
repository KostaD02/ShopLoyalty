import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { Product } from '@app-shared/interfaces';
import { ProductService } from '@app-shared/services';
import { BehaviorSubject, tap } from 'rxjs';
import { GenerateQrComponent, InfoComponent } from './ui';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatDividerModule, AsyncPipe],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AdminComponent implements AfterViewInit {
  private readonly productService = inject(ProductService);
  private readonly platform = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platform);
  private readonly dialog = inject(MatDialog);

  private readonly products$ = new BehaviorSubject<Product[]>([]);
  readonly productsStream$ = this.products$.asObservable();

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.productService
        .getAllProducts()
        .pipe(
          tap((products) => {
            this.products$.next(products);
          }),
        )
        .subscribe();
    }
  }

  showModalForGeneration() {}

  addProduct() {}

  generateQrCode(product: Product) {
    this.dialog.open(GenerateQrComponent, { data: product });
  }

  editInfo(product: Product) {}

  showInfo(product: Product) {
    this.dialog.open(InfoComponent, { data: product });
  }
}
