import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service'; 

@Injectable({
  providedIn: 'root'
})
export class adminAuthGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAdminLoggedIn()) {
      return true; 
    } else {
      this.router.navigate(['/adminLogin']);
      return false; 
    }
  }
}