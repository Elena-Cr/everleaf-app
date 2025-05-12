// src/app/Services/auth.guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';

// Guard for protected routes - redirect to login if not authenticated
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.currentUser$.pipe(
    take(1),
    map((user) => {
      const isLoggedIn = !!user;

      if (isLoggedIn) {
        return true;
      }

      // Not logged in, redirect to login page
      return router.createUrlTree(['/login']);
    })
  );
};

// Guard for auth pages - redirect to plants if already authenticated
export const authPageGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.currentUser$.pipe(
    take(1),
    map((user) => {
      const isLoggedIn = !!user;

      if (!isLoggedIn) {
        return true;
      }

      // Already logged in, redirect to plants page
      return router.createUrlTree(['/plants']);
    })
  );
};
