import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService, SweetAlertService } from '@app-shared/services';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { BaseUser } from '@app-shared/interfaces';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatTabsModule,
    MatFormFieldModule,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AuthComponent {
  private readonly authService = inject(AuthService);
  private readonly sweetAlert = inject(SweetAlertService);

  hidePasswordSignIn = true;
  tabIndex = 0;

  readonly loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  readonly registrationForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(22),
      () => {
        this.registrationForm?.get('repeatPassword')?.enable();
        return null;
      },
    ]),
    repeatPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(22),
      (control) => {
        if (
          control.value !== (this.registrationForm?.get('password') || {}).value
        ) {
          return { matchError: true };
        }
        return null;
      },
    ]),
  });

  login() {
    const { email, password } = this.loginForm.value as {
      email: string;
      password: string;
    };
    this.authService
      .signIn(email, password)
      .pipe(
        catchError((error) => {
          this.sweetAlert.displayError(error);
          return of('Error');
        }),
      )
      .subscribe((result) => {
        if (result !== 'Error') {
          this.loginForm.disable();
        }
      });
  }

  register() {
    const { name, lastName, email, password } = this.registrationForm
      .value as BaseUser;
    this.authService
      .signUp(name, lastName, email, password)
      .pipe(
        catchError((error) => {
          this.sweetAlert.displayError(error);
          return of('Error');
        }),
      )
      .subscribe((result) => {
        if (result !== 'Error') {
          this.reset();
          this.tabIndex = 0;
          this.sweetAlert.displayToast('Registered', 'success', 'green');
        }
      });
  }

  reset(index: number = 0) {
    this.loginForm.reset();
    this.registrationForm.reset();
    this.tabIndex = index;
  }

  getLoginFormValue(control: string, part: string) {
    return (this.loginForm.get(control)?.errors || {})[part] || false;
  }

  getRegisterFormValue(control: string, part: string) {
    return (this.registrationForm.get(control)?.errors || {})[part] || false;
  }
}
