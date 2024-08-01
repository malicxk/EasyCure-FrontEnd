import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../service/admin.service';
import { Specialty } from '../../../model/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-specialties-patient',
  templateUrl: './specialties-patient.component.html',
  styleUrls: ['./specialties-patient.component.css']
})
export class SpecialtiesComponent implements OnInit {
  specialties: Specialty[] = [];
  loading: boolean = true;
  search: string = '';
  page: number = 1;
  limit: number = 10;
  totalSpecialties: number = 0;

  constructor(
    private adminService: AdminService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.fetchSpecialties();
  }

  fetchSpecialties(): void {
    this.loading = true;
    this.adminService.getSpecialtiesPaginated(this.search, this.page, this.limit).subscribe(
      (data: { specialties: Specialty[], total: number }) => {
        this.specialties = data.specialties;
        console.log("The fetched specialties at here is", this.specialties);

        this.totalSpecialties = data.total;
        this.loading = false;
      },
      error => {
        console.error('Error fetching specialties', error);
        this.loading = false;
      }
    );
  }

  onSearch(): void {
    this.page = 1;
    this.fetchSpecialties();
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.fetchSpecialties();
  }

  viewDoctorsBySpecialty(specialtyName: string, specialtyId: string): void {
    this.router.navigate(['/specialtyDoctors', specialtyName, specialtyId]);
  }
}
