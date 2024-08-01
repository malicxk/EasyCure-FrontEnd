import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DoctorService } from '../../../service/doctor-service.service';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../../shared/layout.service';

@Component({
  selector: 'app-doc-otp',
  templateUrl: './doc-otp.component.html',
  styleUrl: './doc-otp.component.css'
})
export class DocOTPComponent implements OnInit, OnDestroy {
  otpForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  timerValue: string = '01:00';
  private timer: any;
  docEmail!: string
  otpSubscription?: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private docService: DoctorService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private layoutService: LayoutService
  ) {
    this.otpForm = this.formBuilder.group({
      digit1: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit2: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit3: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit4: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit5: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit6: ['', [Validators.required, Validators.pattern('[0-9]')]],
    });
  }

  ngOnInit(): void {
    this.layoutService.setShowHeader(false);
    this.startTimer(60);
    this.route.queryParams.subscribe((params: Params) => {
      this.docEmail = params['email'];
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

  submitOTP() {
    if (this.otpForm.invalid) {
      this.messageService.add({ severity: 'warn', summary: '', detail: 'Please fill in all the digits correctly.' });
      return;
    }
    const otpString = Object.values(this.otpForm.value).join('');
    const otpNumber = Number(otpString);
    this.docService.docVerifyOTP(otpNumber).subscribe({
      next: () => {
        this.successMessage = 'OTP verified successfully!';
        this.messageService.add({ severity: 'success', summary: 'OTP verified', detail: 'Doctor Registered Successfully..' });
        setTimeout(() => {
          this.router.navigate(['/doctorLogin']);
        }, 2000);
      },
      error: (err) => {
        if (err.error === 'TokenExpiredError') {
          this.errorMessage = 'OTP expired. Please request a new one.';
          this.messageService.add({ severity: 'error', summary: '', detail: err.error.message });
        } else {
          this.messageService.add({ severity: 'error', summary: '', detail: err.error.message });
          this.errorMessage = 'Invalid OTP. Please try again.';
        }
      }
    });
  }

  resendOTP() {
    this.errorMessage = null; // Clear any previous error message;
    this.successMessage = null; // Clear any previous success message;
    this.docService.resendOTP(this.docEmail).subscribe({
      next: (response) => {
        setTimeout(() => {
          this.errorMessage = null;
        }, 100)
        this.messageService.add({ severity: 'success', summary: 'OTP Resended!!', detail: response.message });
        this.successMessage = response.message;
        this.startTimer(60);
      },
      error: (error) => {
        this.errorMessage = error;
        this.messageService.add({ severity: 'error', summary: '', detail: error.error.message });
      }
    })
  }

  ngOnDestroy(): void {
    if (this.otpSubscription) {
      this.otpSubscription.unsubscribe();
    }
    this.layoutService.setShowHeader(true);
  }

}
