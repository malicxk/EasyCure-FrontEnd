import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../../service/admin.service';
import { Specialty } from '../../../model/auth';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-specialty',
  templateUrl: './add-specialty.component.html',
  styleUrls: ['./add-specialty.component.css']
})
export class AddSpecialtyComponent implements OnInit, OnDestroy {
  specialty: Specialty = {
    _id: '',
    specialtyName: '',
    specialtyImage: null,
    isDocAvailable: true,
    amount: null,
    doctors: [] // Array to hold selected doctors
  };
  imageUrl!: string | ArrayBuffer | null;
  doctors: any[] = []; // Array to store fetched doctors
  addSpecialtySubs?: Subscription;

  constructor(
    private adminService: AdminService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.fetchDoctors();
  }

  fetchDoctors(): void {
    this.adminService.getDoctors().subscribe({
      next: (doctors: any[]) => {
        this.doctors = doctors;
      },
      error: (error: any) => {
        console.error('Error fetching doctors:', error);
      }
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.specialty.specialtyImage = file;

    const reader = new FileReader();
    reader.onload = e => this.imageUrl = reader.result;
    reader.readAsDataURL(file);
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('specialtyName', this.specialty.specialtyName);
    if (this.specialty.specialtyImage) {
      formData.append('specialtyImage', this.specialty.specialtyImage);
    }
    formData.append('isDocAvailable', String(this.specialty.isDocAvailable));
    if (this.specialty.amount !== null) {
      formData.append('amount', String(this.specialty.amount));
    }
    this.addSpecialtySubs = this.adminService.addSpecialty(formData).subscribe(
      (response) => {
        this.messageService.add({ severity: 'success', summary: 'Specialty added', detail: response.message });
        setTimeout(() => {
          this.router.navigate(['/specialtiesList']);
        }, 1000);
      },
      error => {
        console.error('Error adding specialty', error);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.addSpecialtySubs) {
      this.addSpecialtySubs.unsubscribe();
    }
  }



}