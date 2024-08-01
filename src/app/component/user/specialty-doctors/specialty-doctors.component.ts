import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Doctor, Specialty } from '../../../model/auth';
import { AdminService } from '../../../service/admin.service';

@Component({
  selector: 'app-specialty-doctors',
  templateUrl: './specialty-doctors.component.html',
  styleUrls: ['./specialty-doctors.component.css']
})
export class SpecialtyDoctorsComponent implements OnInit {
  doctors: Doctor[] = [];
  specialtyName: string = '';
  specialtyId: string = '';

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.specialtyName = params['specialtyName'];
      if (this.specialtyName) {
        this.fetchDoctorsBySpecialty(this.specialtyName);
      }
    });
    //this is for specialtyId

    this.route.params.subscribe(params => {
      this.specialtyId = params['specialtyId']
      console.log("The id received specialyt id is", this.specialtyId);

    })
  }

  fetchDoctorsBySpecialty(specialtyName: string): void {
    this.adminService.getDoctorsBySpecialty(specialtyName).subscribe({
      next: (response: any) => {
        const doctors = response.doctors.filter((doctor: any) => !doctor.isBlocked && doctor.isVerified);
        console.log("Fetched doctors:", doctors);
        this.doctors = doctors
      },
      error: (error: any) => {
        console.error('Error fetching doctors by specialty:', error);
      }
    });
  };

  goToSlotBook(doctorId: string, consultationMethod: string): void {
    this.router.navigate(['/bookSlot', doctorId, consultationMethod], { queryParams: { specialtyId: this.specialtyId } });
  }

  goToDoctorFeedbacks(doctorId: string) {
    this.router.navigate(['/feedbacks'], { queryParams: { doctorId: doctorId } })
  }


}
