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
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

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
    MatIconModule,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AdminComponent implements AfterViewInit {
  private readonly productService = inject(ProductService);
  private readonly dialog = inject(MatDialog);
  private readonly utilsService = inject(UtilsService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly platform = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platform);

  private readonly products: Product[] = [];

  private readonly products$ = new BehaviorSubject<Product[]>([]);
  readonly productsStream$ = this.products$.asObservable();

  searchValue = this.activatedRoute.snapshot.queryParams['search'] || '';

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.productService
        .getAllProducts()
        .pipe(
          tap((products) => {
            this.products$.next(products);
            this.products.push(...products);
            this.applyFilter();
            this.router.navigate([], { replaceUrl: true });
          }),
        )
        .subscribe();
    }
  }

  showModalForGeneration() {
    this.dialog.open(GenerateQrAllComponent, {
      autoFocus: false,
      data: this.products$.value.map((product) => ({
        ...product,
        productUrl: this.utilsService.generateUrlForQrCode(product._id),
      })),
    });
  }

  addProduct() {
    this.dialog
      .open(CreateProductComponent, { autoFocus: false })
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
    this.dialog.open(GenerateQrComponent, { data: product, autoFocus: false });
  }

  editInfo(product: Product, index: number) {
    this.dialog
      .open(EditComponent, { data: product, autoFocus: false })
      .afterClosed()
      .pipe(
        tap((updatedProduct) => {
          if (updatedProduct) {
            this.products[index] = updatedProduct;
            this.products$.next(this.products);
          }
        }),
      )
      .subscribe();
  }

  showInfo(product: Product) {
    this.dialog.open(InfoComponent, { data: product, autoFocus: false });
  }

  deleteProduct(produt: Product, index: number) {
    this.dialog
      .open(DeleteProductComponent, { data: produt, autoFocus: false })
      .afterClosed()
      .pipe(
        tap((isDeleted) => {
          if (isDeleted) {
            this.products.splice(index, 1);
            this.products$.next(this.products);
          }
        }),
      )
      .subscribe();
  }

  applyFilter() {
    const filterValue = this.searchValue.trim().toLowerCase();

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
