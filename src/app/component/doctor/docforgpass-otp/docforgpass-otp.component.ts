import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DoctorService } from '../../../service/doctor-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../../shared/layout.service';

@Component({
  selector: 'app-docforgpass-otp',
  templateUrl: './docforgpass-otp.component.html',
  styleUrl: './docforgpass-otp.component.css'
})
export class DocforgpassOtpComponent implements OnInit, OnDestroy {
  verifyOtpForm: FormGroup;
  errorMessage: string | null = null;
  docEmail!: string
  timerValue: string = '01:00';
  private timer: any;
  successMessage!: string | null;
  forgPassotpSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private docService: DoctorService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private layoutService:LayoutService
  ) {
    this.verifyOtpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
    });
  }

  startTimer(seconds: number) {
    let counter = seconds;
    this.timer = setInterval(() => {
      const minutes = Math.floor(counter / 60);
      const secs = counter % 60;
      this.timerValue = `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
      counter--;

      if (counter < 0) {
        this.timerValue = '00:00';
        this.errorMessage = 'OTP expired. Please request a new one.';
        clearInterval(this.timer);
      }
    }, 1000);
  }

  ngOnInit(): void {
    this.layoutService.setShowHeader(false);
    this.startTimer(60);
    this.route.queryParams.subscribe(params => {
      this.docEmail = params['email'];
    });
  }

  onSubmit() {
    if (this.verifyOtpForm.invalid) {
      this.messageService.add({ severity: 'warn', summary: '', detail: 'Please fill in all the digits correctly.' });
      return;
    }
    const otpString = Object.values(this.verifyOtpForm.value).join('');
    const otpNumber = Number(otpString);
    const token = localStorage.getItem('otpToken');
    if (!token) {
      this.errorMessage = 'Token not found. Please sign up again.';
      return;
    }
    this.docService.forgPassverifyOTP(otpNumber, token).subscribe({
      next: (response) => {
        this.messageService.add({ severity: 'success', summary: 'Reset your password', detail: response.message });
        setTimeout(() => {
          this.router.navigate(['/docResetPassword'], { queryParams: { email: this.docEmail } });
        }, 2000)
      },
      error: (err) => {
        if (err.error === 'TokenExpiredError') {
          this.messageService.add({ severity: 'error', summary: 'OTP Verification Failed', detail: err.error.message });
          this.errorMessage = 'OTP expired. Please request a new one.';
        } else {
          this.errorMessage = 'Invalid OTP. Please try again.';
          this.messageService.add({ severity: 'error', summary: 'Invalid OTP', detail: err.error.message });
        }
      }
    });
  }

  resendOTP() {
    this.errorMessage = null;
    this.successMessage = null;
    this.docService.resendOTP(this.docEmail).subscribe({
      next: (response) => {
        setTimeout(() => {
          this.errorMessage = null;
        }, 100)
        this.messageService.add({ severity: 'success', summary: 'OTP Resended', detail: response.message });
        this.successMessage = response.message;
        this.startTimer(60);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Resend OTP Failed', detail: error.error.message });
        this.errorMessage = error;
      }
    })
  }

  ngOnDestroy(): void {
    if (this.forgPassotpSubscription) {
      this.forgPassotpSubscription.unsubscribe();
    }
    this.layoutService.setShowHeader(true);
  }

}
