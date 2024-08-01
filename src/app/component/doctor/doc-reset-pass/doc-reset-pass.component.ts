import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DoctorService } from '../../../service/doctor-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../../shared/layout.service';

@Component({
  selector: 'app-doc-reset-pass',
  templateUrl: './doc-reset-pass.component.html',
  styleUrl: './doc-reset-pass.component.css'
})

export class DocResetPassComponent implements OnInit, OnDestroy {
  resetPasswordForm!: FormGroup;
  errorMessage: string | null = null;
  docEmail: string | null = null;
  resetPasswordSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private docService: DoctorService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private layoutService:LayoutService
  ) { }

  ngOnInit(): void {
    this.layoutService.setShowHeader(false)
    this.resetPasswordForm = this.fb.group({
      Password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    this.route.queryParams.subscribe(params => {
      this.docEmail = params['email'];
    });
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid && this.docEmail) {
      const Password = this.resetPasswordForm.value.Password;
      this.docService.resetPassword(this.docEmail, Password).subscribe({
        next: (response) => {
          response.message;
          this.messageService.add({ severity: 'success', summary: 'Password Resetted!!!', detail: response.message });
          setTimeout(() => {
            this.router.navigate(['/doctorLogin']);
          }, 2000)
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Failed to reset password!!!', detail: error.error.message });
          this.errorMessage = error.message || 'Reset password failed';
        }
      });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Password mistmatch', detail: 'Please ensure both passwords are same!!!' });
      this.errorMessage = 'Please enter a valid password and make sure both passwords match.';
    }
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const Password = formGroup.get('Password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    if (Password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
    }
  }

  ngOnDestroy(): void {
    if (this.resetPasswordSubscription) {
      this.resetPasswordSubscription.unsubscribe();
    }
    this.layoutService.setShowHeader(false);
  }
}
