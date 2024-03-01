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
import { ProductService, UtilsService } from '@app-shared/services';
import { BehaviorSubject, tap } from 'rxjs';
import {
  CreateProductComponent,
  DeleteProductComponent,
  EditComponent,
  GenerateQrAllComponent,
  GenerateQrComponent,
  InfoComponent,
} from './ui';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    AsyncPipe,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AdminComponent implements AfterViewInit {
  private readonly productService = inject(ProductService);
  private readonly platform = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platform);
  private readonly dialog = inject(MatDialog);
  private readonly utilsService = inject(UtilsService);

  private readonly products: Product[] = [];

  private readonly products$ = new BehaviorSubject<Product[]>([]);
  readonly productsStream$ = this.products$.asObservable();

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.productService
        .getAllProducts()
        .pipe(
          tap((products) => {
            this.products$.next(products);
            this.products.push(...products);
          }),
        )
        .subscribe();
    }
  }

  showModalForGeneration() {
    this.dialog.open(GenerateQrAllComponent, {
      data: this.products$.value.map((product) => ({
        ...product,
        productUrl: this.utilsService.generateUrlForQrCode(product._id),
      })),
    });
  }

  addProduct() {
    this.dialog
      .open(CreateProductComponent)
      .afterClosed()
      .pipe(
        tap((result) => {
          if (result) {
            this.products.push(result);
            this.products$.next(this.products);
          }
        }),
      )
      .subscribe();
  }

  generateQrCode(product: Product) {
    this.dialog.open(GenerateQrComponent, { data: product });
  }

  editInfo(product: Product) {
    this.dialog.open(EditComponent, { data: product });
  }

  showInfo(product: Product) {
    this.dialog.open(InfoComponent, { data: product });
  }

  deleteProduct(produt: Product) {
    this.dialog.open(DeleteProductComponent, { data: produt });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    if (filterValue === '') {
      this.products$.next(this.products);
    } else {
      this.products$.next(
        this.products.filter(
          (product) =>
            product.name.includes(filterValue) ||
            product.price.toString().includes(filterValue) ||
            product.description.includes(filterValue),
        ),
      );
    }
  }
}
