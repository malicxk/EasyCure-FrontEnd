import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  isUserLoggedIn(): boolean {
    const token = localStorage.getItem('refreshToken');
    return !!token;
  }

  isAdminLoggedIn(): boolean {
    const token = localStorage.getItem('adminToken');
    return !!token;
  }

  isDoctorLoggedIn(): boolean {
    const token = localStorage.getItem('docToken');
    return !!token;
  }


  userlogout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/login']);
  }

  adminlogout(): void {
    localStorage.removeItem('adminToken');
    this.router.navigate(['/adminLogin']);
  }

  doctorlogout(): void {
    console.log("enter doc logout");

    localStorage.removeItem('docToken');
    this.router.navigate(['/doctorLogin']);
  }


  userToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  adminToken(): string | null {
    return localStorage.getItem('adminToken');
  }

  doctorToken(): string | null {
    return localStorage.getItem('docToken');
  }

}