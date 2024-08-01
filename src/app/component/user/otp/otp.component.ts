import { Component, OnInit ,OnDestroy} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../../service/account.service';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../../shared/layout.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent implements OnInit ,OnDestroy {
  otpForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  timerValue: string = '01:00';
  private timer: any;
  userEmail!: string
  signUpSubscription?: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private layoutService:LayoutService
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
    this.layoutService.setShowHeader(false)
    this.startTimer(60);
    this.route.queryParams.subscribe((params: Params) => {
      this.userEmail = params['email'];
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
    if (!this.otpForm.valid) {
      this.otpForm.markAsTouched({ onlySelf: true });
      this.messageService.add({ severity: 'warn', summary: '', detail: 'Please enter OTP' });
      return;
    }
    const otpString = Object.values(this.otpForm.value).join('');
    const otpNumber = Number(otpString);
    this.accountService.verifyOTP(otpNumber).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "User registered..!" });
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000)
      },
      error: (err) => {
        if (err.error === 'TokenExpiredError') {
          this.errorMessage = 'OTP expired. Please request a new one.';
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message });
        } else {
          this.errorMessage = 'Invalid OTP. Please try again.';
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message });
        }
      }
    });
  }

  resendOTP() {
    this.errorMessage = null; // Clear any previous error message;
    this.successMessage = null; // Clear any previous success message;
    this.accountService.resendOTP(this.userEmail).subscribe({
      next: (response) => {
        localStorage.setItem('otpToken', response.token);
        //to clear any previous error messages...
        setTimeout(() => {
          this.errorMessage = null;
        }, 100)
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "OTP resended to your email..Please Check..!" });
        this.startTimer(60);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
        this.errorMessage = error;
      }
    })
  }

  ngOnDestroy(): void {
    if (this.signUpSubscription) {
      this.signUpSubscription.unsubscribe();
    }
    this.layoutService.setShowHeader(true)
  }
}
