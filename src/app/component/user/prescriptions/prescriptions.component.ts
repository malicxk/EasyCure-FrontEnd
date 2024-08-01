import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../service/account.service';
import { Prescription } from '../../../model/auth';

@Component({
  selector: 'app-prescriptions',
  templateUrl: './prescriptions.component.html',
  styleUrl: './prescriptions.component.css'
})
export class PrescriptionsComponent implements OnInit {
  patientId = JSON.parse(localStorage.getItem('user')!)._id;
  prescription: Prescription[] = [];

  constructor(
    private userService: AccountService
  ) { }


  ngOnInit(): void {
    this.fetchPrescriptions();
  };

  fetchPrescriptions(): void {
    this.userService.getPrescriptionsByPatientId(this.patientId).subscribe({
      next: (data: Prescription[]) => {
        this.prescription = data;
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
