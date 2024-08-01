import { Component, OnInit ,OnDestroy} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  Router } from '@angular/router';
import { AccountService } from '../../../service/account.service';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../../shared/layout.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit,OnDestroy {
  forgotPasswordForm!: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  signUpSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private messageService: MessageService,
    private layoutService:LayoutService
  ) {}

  ngOnInit(): void {
    this.layoutService.setShowHeader(false);
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (!this.forgotPasswordForm.valid) {
      this.forgotPasswordForm.markAsTouched({ onlySelf: true });
      this.messageService.add({ severity: 'warn', summary: '', detail: 'Please enter your registered email id' });
      return;
    }

    if (this.forgotPasswordForm.valid) {
      this.accountService.forgotPassword(this.forgotPasswordForm.value.email).subscribe({
        next: (response) => {
          this.successMessage = response.message;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
          setTimeout(()=>{
            this.router.navigate(['/forgotPassOTP'],{ queryParams: { email: this.forgotPasswordForm.value.email } });
          },2000)
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
          this.errorMessage = error.error.message || 'Failed to send email';
        }
      });
    }
  }

  ngOnDestroy(): void {
   if( this.signUpSubscription){
    this.signUpSubscription.unsubscribe();
   }
   this.layoutService.setShowHeader(true);
  }
}

