import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../../service/account.service';
import { loginCredentials } from '../../../model/auth';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../../shared/layout.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  errorMessage: string | null = null;
  loginSubscription?: Subscription

  constructor(
    private accountService: AccountService,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    private layoutService: LayoutService,
  ) { }


  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    this.layoutService.setShowHeader(false);
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Form Submitted', this.loginForm.value);
      const loginData: loginCredentials = this.loginForm.value;
      this.login(loginData);
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Fill the fields', detail: 'Please fill in all required fields correctly.' });
    }
  }

  login(LoginDatas: loginCredentials): void {
    this.accountService.login(LoginDatas).subscribe({
      next: (response) => {
        console.log(response);
        localStorage.setItem('accessToken', response.token.accessToken);// saving access token
        localStorage.setItem('refreshToken', response.token.refreshToken);// saving refresh token
        //setting userData into the local storage.
        localStorage.setItem('user', JSON.stringify(response.user));
        this.router.navigate(['/userHome']); // Redirect to dashboard
      },
      error: (err: { error: { message: string } }) => {
        this.messageService.add({ severity: 'error', summary: 'Login Failed', detail: err.error.message || "Invalid Email or Password" });
      }
    });
  }


  ngOnDestroy(): void {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
    this.layoutService.setShowHeader(true);
  }
}
