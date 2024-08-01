import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignUpResponse, Specialty, docSignUpCredential } from '../../../model/auth';
import { DoctorService } from '../../../service/doctor-service.service';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../../shared/layout.service';
import { AdminService } from '../../../service/admin.service';

@Component({
  selector: 'app-doctor-sign-up',
  templateUrl: './doctor-sign-up.component.html',
  styleUrl: './doctor-sign-up.component.css'
})
export class DoctorSignUpComponent implements OnInit, OnDestroy {
  signUpForm!: FormGroup;
  signUpSubscription?: Subscription;
  specialties: Specialty[] = [];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private docService: DoctorService,
    private messageService: MessageService,
    private layoutService: LayoutService,
    private adminService: AdminService
  ) { }

  ngOnInit(): void {
    this.layoutService.setShowHeader(false);
    this.createForm();
    this.fetchSpecialties()
  }

  createForm() {
    this.signUpForm = this.fb.group({
      doctorname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],  // Add confirmPassword field here
      dateOfbirth: ['', [Validators.required, Validators.min(1)]],
      specialty: ['', Validators.required],
      description: ['', Validators.required],
      workExperience: ['', Validators.required],
    }, {
      validator: (control: AbstractControl) => {
        const password = control.get('password');
        const confirmPassword = control.get('confirmPassword');

        if (!password || !confirmPassword) {
          return null;
        }
        return password.value === confirmPassword.value ? null : { passwordMismatch: true };
      }
    });
  }

  onSubmit(): void {
    const docEmail = this.signUpForm.value.email;
    if (this.signUpForm.valid) {
      const formData: docSignUpCredential = this.signUpForm.value;
      this.docService.docSignUp(formData).subscribe({
        next: (response: SignUpResponse) => {
          console.log("Success:", response);
          this.messageService.add({ severity: 'success', summary: 'OTP Sended', detail: response.message });
          setTimeout(() => {
            this.router.navigate(['/docOTP'], { queryParams: { email: docEmail } });
          }, 2000)
        },
        error: (error) => {
          console.error('Error:', error);
          this.messageService.add({ severity: 'error', summary: '', detail: error.error.message });
        },
        complete: () => {
          console.log("Request Completed");
        }
      });
    } else {
      this.signUpForm.markAsTouched({ onlySelf: true });
      this.messageService.add({ severity: 'warn', summary: '', detail: 'Please fill all the required fields correctly!!!' });
    }
  }

  fetchSpecialties(): void {
    this.adminService.getSpecialties().subscribe({
      next: (specialties: Specialty[]) => {
        this.specialties = specialties;
        console.log("The specialties are", this.specialties);
      },
      error: (error: any) => {
        console.error('Error fetching specialties:', error);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.signUpSubscription) {
      this.signUpSubscription.unsubscribe();
    }
    this.layoutService.setShowHeader(true);
  }

  navigateToLogin(event: MouseEvent): void {
    event.preventDefault(); // Prevent the default action
    this.router.navigate(['/doctorLogin']);
  }
}
