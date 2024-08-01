import { Component, OnInit, OnDestroy } from '@angular/core';
import { LayoutService } from '../../../shared/layout.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../service/auth.service';
import { Doctor, Specialty } from '../../../model/auth';
import { AdminService } from '../../../service/admin.service';
import { Router } from '@angular/router';
import { AccountService } from '../../../service/account.service';


@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent implements OnInit, OnDestroy {
  userHomeSubscription?: Subscription
  doctors: Doctor[] = [];
  specialties: Specialty[] = [];
  imageUrl: string | ArrayBuffer | null = null;

  constructor(
    private layoutService: LayoutService,
    private authService: AuthService,
    private docDetailsService: AdminService,
    private userService: AccountService,
    private adminService: AdminService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.layoutService.setShowFooter(true);
    this.fetchDoctor();
    this.fetchSpecialties();
  }

  fetchDoctor(): void {
    this.userService.getDoctors().subscribe({
      next: (doctors: Doctor[]) => {
        this.doctors = doctors;
        console.log(doctors);//remove this after checking purposes
      },
      error: (error: any) => {
        console.error('Error fetching doctors:', error);
      }
    });
  }

  fetchSpecialties(): void {
    console.log("Entered into fetch specialties");
    this.adminService.getSpecialties().subscribe({
      next: (specialties: Specialty[]) => {
        const filteredSpecialties = specialties.filter((specialty: Specialty) => specialty.isDocAvailable);
        this.specialties = filteredSpecialties.slice(0, 8);
        console.log("speciaties are", specialties); // remove this after checking purposes
      },
      error: (error: any) => {
        console.error('Error fetching specialties:', error);
      }
    });
  }

  viewDoctorsBySpecialty(specialtyName: string, specialtyId: string): void {
    this.router.navigate(['/specialtyDoctors', specialtyName, specialtyId]);
  }

  logout(): void {
    this.authService.userlogout();
  }

  ngOnDestroy(): void {
    this.layoutService.setShowHeader(true);
    if (this.userHomeSubscription) {
      this.userHomeSubscription.unsubscribe();
    }
  }

}
