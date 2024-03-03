import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { TitleStrategy, provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http';

import { JwtModule } from '@auth0/angular-jwt';
import { LocalStorageKeys } from '@app-shared/enums';
import { BACKEND_ENDPOINT_DOMAIN } from './shared';
import { routes } from './app.routes';
import { AppTitleStrategy } from '@app-shared/services';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
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
