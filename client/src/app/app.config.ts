import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { JwtModule } from '@auth0/angular-jwt';
import { routes } from './app.routes';
import { BACKEND_ENDPOINT_DOMAIN } from './shared';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: () => localStorage.getItem('access_token'),
          allowedDomains: [BACKEND_ENDPOINT_DOMAIN],
        },
      }),
    ),
  ],
};
