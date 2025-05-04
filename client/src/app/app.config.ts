import {
  ApplicationConfig,
  provideZoneChangeDetection,
  inject,
} from '@angular/core'; // Import inject
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withInterceptors,
  HttpInterceptorFn,
} from '@angular/common/http'; // Import HttpInterceptorFn

import { routes } from './app.routes';
import { AuthService } from './Services/auth.service'; // Import AuthService

// Define the interceptor function
const basicAuthInterceptorFn: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService); // Inject AuthService
  const authToken = authService.currentAuthCredentials;

  // Get the API base URL from AuthService or environment config if available
  // For now, hardcoding the check - replace with a more robust check if needed
  const isApiRequest = req.url.startsWith('http://localhost:5234/api/');

  // Only add header to API requests, and skip login/register
  if (
    !isApiRequest ||
    req.url.endsWith('/login') ||
    req.url.endsWith('/register')
  ) {
    return next(req);
  }

  if (authToken) {
    // Clone the request and add the authorization header
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Basic ${authToken}`),
    });
    return next(authReq);
  } else {
    // If it's an API request but no token (e.g., user not logged in), let it proceed
    // The server middleware will handle the 401 response
    return next(req);
  }
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([basicAuthInterceptorFn]) // Register the interceptor function
    ),
    // AuthService is providedIn: 'root', so usually no need to list here
  ],
};
