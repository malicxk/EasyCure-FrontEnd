import { Component, OnInit,OnDestroy} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../../service/account.service'; 
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../../shared/layout.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit,OnDestroy {
  resetPasswordForm!: FormGroup;
  errorMessage: string | null = null;
  userEmail: string | null = null;
  resetPassSubscription?:Subscription;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService:MessageService,
    private layoutService:LayoutService
  ) { }
  ngOnDestroy(): void {
    if(this.resetPassSubscription){
      this.resetPassSubscription.unsubscribe();
    }
    this.layoutService.setShowHeader(true);
  }

  ngOnInit(): void {
    this.layoutService.setShowHeader(false)
    this.resetPasswordForm = this.fb.group({
      Password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    this.route.queryParams.subscribe(params => {
      this.userEmail = params['email'];
    });
  }

  onSubmit(): void {
    console.log("Entere reset password front");
    console.log(this.userEmail);
    if (this.resetPasswordForm.valid && this.userEmail) {
      const Password = this.resetPasswordForm.value.Password;
      this.accountService.resetPassword(this.userEmail, Password).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Password Resetted', detail: response.message });
          response.message;
          setTimeout(()=>{
            this.router.navigate(['/login']);
          },2000)
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
          this.errorMessage = error.message || 'Reset password failed';
        }
      });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Passwprd mismatch', detail:'Please enter a valid password and make sure both passwords match.' });
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
}
