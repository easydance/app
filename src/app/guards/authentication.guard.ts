import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthManagerService } from 'src/app/services/auth-manager.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authManager = inject(AuthManagerService);
  if (!authManager.isAuthenticated()) {
    // authManager.logout();
    inject(Router).createUrlTree(['/login']);
  }
  return true;
};