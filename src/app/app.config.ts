import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { AuthClientConfig, provideAuth0 } from '@auth0/auth0-angular';
import { ProgressInterceptor } from '../interceptors/progress.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
   
    provideRouter(routes),
    provideHttpClient(),
      provideAuth0({
        domain: 'dev-fc5lurkbs7t0nlpj.us.auth0.com',
        clientId: 'VB2JleftQqgfnBjqeMKOHh1fKrtHnIQB',
        authorizationParams: {
          redirect_uri: window.location.origin
        }
      }),   
      
      { provide: HTTP_INTERCEPTORS, useClass: ProgressInterceptor, multi: true },
  ],
};