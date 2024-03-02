import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService, SweetAlertService } from '@app-shared/services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, tap } from 'rxjs';
import { BaseUser } from '@app-shared/interfaces';
import { LocalStorageKeys } from '@app-shared/enums';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    MatTabsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SettingsComponent {
  private readonly authService = inject(AuthService);
  private readonly sweetAlertService = inject(SweetAlertService);

  hidePasswordSignIn = true;

  constructor() {
    this.authService.userStream$
      .pipe(
        tap((user) => {
          if (user) {
            this.updateForm.setValue({
              name: user.name,
              lastName: user.lastName,
              email: user.email,
            });
          }
        }),
        takeUntilDestroyed(),
      )
      .subscribe();
  }

  readonly updateForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  readonly passwordForm = new FormGroup({
    oldPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(22),
    ]),
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(22),
    ]),
  });

  getUpdateFormValue(control: string, part: string) {
    return (this.updateForm.get(control)?.errors || {})[part] || false;
  }

  getPasswordFormValue(control: string, part: string) {
    return (this.passwordForm.get(control)?.errors || {})[part] || false;
  }

  updateUser() {
    const user = this.updateForm.value as Omit<BaseUser, 'password'>;
    const streamUser = this.authService.user;

    if (
      streamUser &&
      user.name === streamUser.name &&
      user.lastName === streamUser.lastName &&
      user.email === streamUser.email
    ) {
      this.sweetAlertService.displayToast(
        'Nothing to update',
        'info',
        '#3f51b5',
      );
      return;
    }

    this.authService
      .updatUser(user)
      .pipe(
        tap((user) => {
          this.authService.user = user;
          this.sweetAlertService.displayToast('Updated', 'success', 'green');
        }),
        catchError((error) => {
          this.sweetAlertService.displayError(error);
          return of(null);
        }),
      )
      .subscribe();
  }

  updatePassword() {
    const passwords = this.passwordForm.value as {
      oldPassword: string;
      newPassword: string;
    };
    if (passwords.oldPassword === passwords.newPassword) {
      this.sweetAlertService.displayToast(
        "Passwords can't be same",
        'error',
        'red',
      );
      return;
    }

    this.authService
      .updatePassword(passwords)
      .pipe(
        tap((response) => {
          localStorage.setItem(
            LocalStorageKeys.ACCESS_TOKEN,
            response.access_token,
          );
          localStorage.setItem(
            LocalStorageKeys.REFRESH_TOKEN,
            response.refresh_token,
          );
          this.authService.user = this.authService.decodeToken(
            response.access_token,
          );
          this.sweetAlertService.displayToast('Updated', 'success', 'green');
          this.hidePasswordSignIn = true;
          this.passwordForm.reset();
        }),
        catchError((error) => {
          this.hidePasswordSignIn = true;
          this.sweetAlertService.displayError(error);
          return of(null);
        }),
      )
      .subscribe();
  }

  tabChanged() {
    this.passwordForm.reset();
  }
}
