import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DoctorService } from '../../../service/doctor-service.service';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-doctor-home',
  templateUrl: './doctor-home.component.html',
  styleUrl: './doctor-home.component.css'
})
export class DoctorHomeComponent implements OnInit, OnDestroy {

  doctorProfile: any = {};
  profileSubscription?: Subscription
  photoUploadSubscription?: Subscription;
  selectedFile: File | null = null;
  imageUrl: string | ArrayBuffer | null = null;
  isEditing: boolean = false;

  certificateUrls: string[] = [];
  selectedCertificateFiles: File[] = [];
  isEditingCertificate: boolean = false;
  years = 'Years of Experience'

  constructor(
    private doctorService: DoctorService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.doctorService.getDoctorProfile().subscribe({
      next: profile => {
        console.log("The fetched doctor profile is", profile);

        this.doctorProfile = profile;
        this.imageUrl = profile.profilePhoto;//profile image from backend.....
        this.certificateUrls = profile.certificates;
      },
      error: error => {
        console.error('Error fetching doctor profile', error);
      }
    });
  };

  saveProfile(): void {
    const updatedData = {
      doctorname: this.doctorProfile.doctorname,
      dateOfbirth: this.doctorProfile.dateOfbirth,
      description: this.doctorProfile.description,
      workExperience: this.doctorProfile.workExperience,
    }
    this.doctorService.updateDoctorProfile(updatedData).subscribe({
      next: response => {
        this.messageService.add({ severity: 'success', summary: 'Profile Updated', detail: response.message });
        console.log('Profile updated successfully', response);
      },
      error: error => {
        this.messageService.add({ severity: 'error', summary: 'Updation Failed!!!', detail: error.error.message });
        console.error('Error updating profile', error);
      }
    });
  };

  onEditPhoto() {
    this.isEditing = true;
  };

  onEditCertificate() {
    this.isEditingCertificate = true;
  };

  onFileSelected(event: Event): void {
    console.log("File selecting comp entered.....");
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      // Display the selected image
      const reader = new FileReader();
      reader.onload = e => this.imageUrl = reader.result;
      reader.readAsDataURL(this.selectedFile);
    }
  };

  onUpload(): void {
    if (this.selectedFile) {
      this.doctorService.uploadProfilePhoto(this.selectedFile).subscribe(response => {
        console.log('Profile photo uploaded successfully', response);
        this.messageService.add({ severity: 'success', summary: 'Profile updated', detail: response.message });
      });
    }
  };

  onCertificateSelected(event: Event): void {
    console.log("Certificate selecting component entered...");
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const newFiles = Array.from(input.files);
      let updatedUrls = [...this.certificateUrls];
      let updatedFiles = [...this.selectedCertificateFiles];
      if (updatedUrls.length >= 4) {
        // Remove the oldest file URLs if there are already 4
        updatedUrls.shift();
        updatedFiles.shift();
      }
      newFiles.forEach(file => {
        if (updatedUrls.length < 4) {
          const reader = new FileReader();
          reader.onload = e => updatedUrls.push(reader.result as string);
          reader.readAsDataURL(file);
          updatedFiles.push(file);
        }
      });
      // Update the certificate URLs and files
      this.certificateUrls = updatedUrls;
      this.selectedCertificateFiles = updatedFiles;
    }
  }

  onCertificateUpload() {
    if (this.selectedCertificateFiles.length > 0) {
      this.doctorService.uploadCertificates(this.selectedCertificateFiles).subscribe(response => {
        // Handle response for multiple files
        console.log('Certificates uploaded:', response);
        this.isEditingCertificate = false;
      });
    }
  };

  ngOnDestroy(): void {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
    if (this.photoUploadSubscription) {
      this.photoUploadSubscription.unsubscribe();
    }
  };

  // Method to get file name from URL
  getFileName(url: string): string {
    return url.substring(url.lastIndexOf('/') + 1);
  };

  onDeleteCertificate(certificateUrl: string): void {
    // Logic to delete the specific certificate
    const index = this.certificateUrls.indexOf(certificateUrl);
    if (index > -1) {
      this.certificateUrls.splice(index, 1);
    }
  };




}


