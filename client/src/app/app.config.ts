import { ApplicationConfig, importProvidersFrom, inject } from '@angular/core';
import { TitleStrategy, provideRouter } from '@angular/router';
import { provideClientHydration, Title } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';

import { JwtModule } from '@auth0/angular-jwt';
import { LocalStorageKeys } from '@app-shared/enums';
import { BACKEND_ENDPOINT_DOMAIN } from './shared';
import { routes } from './app.routes';
import { AppTitleStrategy } from '@app-shared/services';
import { EMPTY } from 'rxjs';
import Swal from 'sweetalert2';

export function loggingInterceptor() {
  Swal.fire({
    title: 'Unfortunatelly, Server is down',
    icon: 'info',
    text: 'Please try again later',
    confirmButtonColor: '#3f51b5',
    footer: `Or check code locally <a href="https://github.com/KostaD02/ShopLoyalty" target="_blank">Github</a>`,
  });
  return EMPTY;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(
      withFetch(),
      withInterceptors([loggingInterceptor]),
      withInterceptorsFromDi(),
    ),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: () => {
            if (localStorage) {
              return localStorage.getItem(LocalStorageKeys.ACCESS_TOKEN);
            }
            return null;
          },
          allowedDomains: [BACKEND_ENDPOINT_DOMAIN],
        },
      }),
    ),
    {
      provide: TitleStrategy,
      useClass: AppTitleStrategy,
    },
  ],
};
