import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable, combineLatest } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {
  AFTER_AUTH_NAVIGATION,
  BEFORE_AUTH_NAVIGATION,
  DEFAULT_HEADER_NAVIGATION,
} from '@app-shared/consts';
import { AuthService, CartService } from '@app-shared/services';
import { UserRole } from '@app-shared/enums';
import { MatDialog } from '@angular/material/dialog';
import { CartComponent } from '@app-shared/ui';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    AsyncPipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly dialog = inject(MatDialog);

  readonly user$ = this.authService.userStream$;
  readonly cart$ = this.cartService.cartStream$;

  readonly userRole = UserRole;
  readonly headerNavigation = DEFAULT_HEADER_NAVIGATION;
  readonly afterAuthNavigation = AFTER_AUTH_NAVIGATION;
  readonly beforeAuthNavigation = BEFORE_AUTH_NAVIGATION;

  readonly isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay(),
    );

  readonly vm$ = combineLatest([this.isHandset$, this.user$, this.cart$]).pipe(
    map(([isHandset, user, cart]) => ({
      isHandset,
      user,
      cart,
    })),
  );

  showCart() {
    this.dialog.open(CartComponent, {
      height: `100vh`,
      width: `100%`,
      maxWidth: `280px`,
      position: { top: '0', right: '0' },
      autoFocus: false,
    });
  }

  logOut() {
    this.authService.logOut();
  }
}
