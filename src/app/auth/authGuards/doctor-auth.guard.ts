import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service'; 

@Injectable({
  providedIn: 'root'
})
export class doctorAuthGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isDoctorLoggedIn()) {
      return true; 
    } else {
      this.router.navigate(['/doctorLogin']);
      return false; 
    }
  }
}