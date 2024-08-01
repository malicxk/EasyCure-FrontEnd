import { Component } from '@angular/core';
import { AccountService } from '../../../service/account.service';
import { Prescription, User } from '../../../model/auth';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrl: './patient-details.component.css'
})
export class PatientDetailsComponent {
  patientId: string = '';
  prescription: Prescription[] = [];
  user!: User;
  consultationCount: number = 0;

  constructor(
    private userService: AccountService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.patientId = params['patientId'];
      console.log("The patient id is", this.patientId);
      this.fetchUserDetails(this.patientId)
    });
   
    this.fetchPrescriptions();
  };

  fetchUserDetails(patientId:string) {
    this.userService.getUserProfile(patientId).subscribe({
      next: (user) => {
        this.user = user;
        console.log("The fetched user details is ", this.user);
      },
      error: (error) => {
        console.error('Error fetching user profile:', error);
      }
    });
  }

  fetchPrescriptions(): void {
    this.userService.getPrescriptionsByPatientId(this.patientId).subscribe({
      next: (data: Prescription[]) => {
        this.prescription = data;
        this.consultationCount = data.length;
        console.log('Fetched prescriptions:', this.prescription);
      },
      error: (error) => console.error('Error fetching prescriptions:', error)
    });
  };

  downloadPrescription(prescriptionId: string) {
    console.log("Downloading prescription with ID:", prescriptionId);
    this.userService.downloadPrescription(prescriptionId).subscribe(
      (response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'E-prescription.pdf';
        link.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error downloading prescription:', error);
      }
    );
  };

}
