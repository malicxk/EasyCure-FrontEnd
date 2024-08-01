import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../../service/account.service'; // Adjust the path as necessary
import { Router } from '@angular/router';
import { SignUpResponse, signUpCredential } from '../../../model/auth'; // Adjust the path as necessary
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../../shared/layout.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  signUpForm!: FormGroup;
  signUpSubscription?: Subscription;
  showToast = false;
  toastDetail = '';

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private messageService: MessageService,
    private layoutService: LayoutService
  ) { }

  ngOnInit(): void {
    this.layoutService.setShowHeader(false);
    this.createForm();
  }

  createForm() {
    this.signUpForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)]],
      confirmPassword: ['', Validators.required],
      dateOfbirth: ['', Validators.required]
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
    if (this.signUpForm.valid) {
      const formData: signUpCredential = this.signUpForm.value;
      this.accountService.signUp(formData).subscribe({
        next: (response: SignUpResponse) => {
          console.log('Success:', response);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
          setTimeout(() => {
            this.router.navigate(['/otp'], { queryParams: { email: formData.email } });
          }, 3000);
        },
        error: (error) => {
          console.error('Error:', error);
          this.messageService.add({ severity: 'error', summary: 'SignUp Failed', detail: error.error.message });
        },
        complete: () => {
          console.log('Request completed');
        }
      });
    } else {
      this.signUpForm.markAsTouched({ onlySelf: true });
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please fill all required fields correctly!' });
    }
  }


  ngOnDestroy(): void {
    if (this.signUpSubscription) {
      this.signUpSubscription.unsubscribe();
    }
    this.layoutService.setShowHeader(true);
  }
}





