import {
  ApplicationConfig,
  provideZoneChangeDetection,
  inject,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withInterceptors,
  HttpInterceptorFn,
} from '@angular/common/http';

import { routes } from './app.routes';
import { AuthService } from './Services/auth.service';

const basicAuthInterceptorFn: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authToken = authService.currentAuthCredentials;

  const isApiRequest = req.url.startsWith('http://localhost:5234/api/');

  if (
    !isApiRequest ||
    req.url.endsWith('/login') ||
    req.url.endsWith('/register')
  ) {
    return next(req);
  }

  if (authToken) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Basic ${authToken}`),
    });

    return next(authReq);
  } else {
    return next(req);
  }
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([basicAuthInterceptorFn])),
  ],
};
