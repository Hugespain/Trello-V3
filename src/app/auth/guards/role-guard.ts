import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const allowedRoles = route.data['allowedRoles'];
    const currentUser = this.authService.currentUser();

    return currentUser && allowedRoles.includes(currentUser.role);
  }
}
