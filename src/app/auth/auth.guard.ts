import { CanActivateFn, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isAuthenticated$.pipe(
    take(1),
    map(isAuth => {
      if (isAuth) return true;
      return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    })
  );
};

