import { Component,OnInit,OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  Router } from '@angular/router';
import { DoctorService } from '../../../service/doctor-service.service';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../../shared/layout.service';

@Component({
  selector: 'app-doc-forg-pass',
  templateUrl: './doc-forg-pass.component.html',
  styleUrl: './doc-forg-pass.component.css'
})
export class DocForgPassComponent implements OnInit,OnDestroy {
  forgotPasswordForm!: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  forgotPassSubscription?:Subscription;

  constructor(
    private fb: FormBuilder,
    private docService:DoctorService,
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
    if (this.forgotPasswordForm.valid) {
      this.docService.forgotPassword(this.forgotPasswordForm.value.email).subscribe({
        next: (response) => {
          this.successMessage = response.message;
          this.messageService.add({ severity: 'success', summary: 'OTP Sended', detail: response.message });
          setTimeout(()=>{
            this.router.navigate(['/docForgotPassOTP'],{ queryParams: { email: this.forgotPasswordForm.value.email } });
          },2000)
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Failed to Send OTP', detail:error.error.message });
          this.errorMessage = error.error.message || 'Failed to send email';
        }
      });
    }else{
      this.messageService.add({ severity: 'warn', summary: '', detail: 'Please enter your email address.'});
    }
  }

  ngOnDestroy(): void {
    if(this.forgotPassSubscription){
     this.forgotPassSubscription.unsubscribe()
    }
    this.layoutService.setShowHeader(true);
   }

}
