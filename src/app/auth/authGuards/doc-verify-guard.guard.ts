import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { DoctorService } from '../../service/doctor-service.service';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class DocVerifyGuard implements CanActivate {

  constructor(
    private doctorService: DoctorService,
    private router: Router,
    private messageService: MessageService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.doctorService.getDoctorProfile().pipe(
      map(profile => {
        if (profile && profile.isVerified) {
          return true;
        } else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'You need to be verified to access this page.' });
          this.router.navigate(['/docProfile']);
          return false;
        }
      }),
      catchError(error => {
        console.error('Error fetching doctor profile', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while checking your verification status.' });
        this.router.navigate(['/doctorLogin']); // Redirect to home or some other page
        return of(false);
      })
    );
  }
}

