import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../service/admin.service';
import { Doctor } from '../../../model/auth';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../../shared/layout.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-doctor-viewprofile',
  templateUrl: './doctor-viewprofile.component.html',
  styleUrl: './doctor-viewprofile.component.css'
})
export class DoctorViewprofileComponent implements OnInit, OnDestroy {
  doctor?: Doctor;
  profileSubscription?: Subscription;
  imageUrl: string | ArrayBuffer | null = null;
  certificateUrls: string[] = [];
  showCertificateImage: boolean = false;
  visible: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private layoutService: LayoutService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.layoutService.setShowFooter(false);

    const doctorId = this.route.snapshot.paramMap.get('doctorId');
    if (doctorId) {
      this.fetchDoctorDetails(doctorId);
    }
  };

  fetchDoctorDetails(doctorId: string): void {
    this.adminService.getDoctorById(doctorId).subscribe({
      next: (doctor: Doctor) => {
        this.doctor = doctor;
        this.imageUrl = doctor.profilePhoto;
        this.certificateUrls = doctor.certificates;
      },
      error: (error) => {
        console.error('Error fetching doctor details:', error);
      }
    });
  };

  verifyDoctor(doctor: Doctor, newStatus: boolean): void {
    console.log("Enter verify component");
    this.adminService.verifyDoctor(doctor._id, newStatus).subscribe({
      next: (response) => {
        doctor.isVerified = newStatus;
        this.messageService.add({ severity: 'success', summary: 'Verified', detail: response.message });
      },
      error: (error) => {
        console.error('Error verifying doctor:', error);
      }
    });
  };

  openCertificateModal(): void {
    if (this.certificateUrls.length > 0) {
      this.visible = true;
    } else {
      this.messageService.add({ severity: 'info', summary: 'Information', detail: 'Certificate is not uploaded by the doctor.' });
    }
  }

  closeCertificateModal(): void {
    this.visible = false;
  }

  ngOnDestroy(): void {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
    this.layoutService.setShowFooter(true);
  };


};
