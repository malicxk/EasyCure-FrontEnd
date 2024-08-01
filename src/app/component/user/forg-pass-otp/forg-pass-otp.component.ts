import { Component,OnInit,OnDestroy} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../../service/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../../shared/layout.service';


@Component({
  selector: 'app-forg-pass-otp',
  templateUrl: './forg-pass-otp.component.html',
  styleUrl: './forg-pass-otp.component.css'
})
export class ForgPassOtpComponent implements OnInit,OnDestroy{
  verifyOtpForm: FormGroup;
  errorMessage: string | null = null;
  userEmail!:string
  timerValue: string = '01:00';
  private timer: any;
  successMessage!: string|null;
  signUpSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
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
      this.userEmail = params['email'];
    });
  }

  onSubmit() {
    if (this.verifyOtpForm.invalid) {
      this.errorMessage = 'Please fill in all the digits correctly.';
      return;
    }
    const otpString = Object.values(this.verifyOtpForm.value).join('');
    const otpNumber = Number(otpString);
    this.accountService.forgPassverifyOTP(otpNumber).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Email Verified', detail: "Reset your Password!!" });
        setTimeout(()=>{
          this.router.navigate(['/resetPassword'],{ queryParams: { email: this.userEmail } });
        },2000)
      },
      error: (err) => {
        if (err.error === 'TokenExpiredError') {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message });
          this.errorMessage = 'OTP expired. Please request a new one.';
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message });
          this.errorMessage = 'Invalid OTP. Please try again.';
        }
      }
    });
  }

  resendOTP(){
    this.errorMessage = null; // Clear any previous error message;
    this.successMessage = null; // Clear any previous success message;
    this.accountService.resendOTP(this.userEmail).subscribe({
      next: (response) => {
        //to clear any previous error messages...
        setTimeout(() => {
          this.errorMessage = null;
        }, 100)
        this.successMessage = response.message;//Displays the Success Message that sends from the Backend;
        this.messageService.add({ severity: 'success', summary: 'OTP Resended', detail: "Please check your email for the otp" });
        this.startTimer(60);
      },
      error: (error) => {
        this.errorMessage = error;
      }
    })
  }

  ngOnDestroy(): void {
    if( this.signUpSubscription){
     this.signUpSubscription.unsubscribe();
    }
    this.layoutService.setShowHeader(true);
   }
}
