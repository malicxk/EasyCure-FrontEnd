import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DoctorService } from '../../../service/doctor-service.service';
import { loginCredentials } from '../../../model/auth';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../../shared/layout.service';

@Component({
  selector: 'app-doctor-login',
  templateUrl: './doctor-login.component.html',
  styleUrl: './doctor-login.component.css'
})
export class DoctorLoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  errorMessage: string | null = null;
  loginSubscription?: Subscription

  constructor(
    private docService: DoctorService,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    private layoutService:LayoutService
  ) { }

  ngOnInit(): void {
    this.layoutService.setShowHeader(false);
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Form Submitted', this.loginForm.value);
      const loginData: loginCredentials = this.loginForm.value;
      this.login(loginData);
    } else {
      this.messageService.add({ severity: 'error', summary: '', detail: 'Please fill in all required fields correctly.' });
    }
  }

  login(LoginDatas: loginCredentials): void {
    this.docService.login(LoginDatas).subscribe({
      next: (response: { token: string ,doctor:string}) => {
        localStorage.setItem('docToken', response.token);
        localStorage.setItem('doctor',JSON.stringify(response.doctor));
        this.router.navigate(['/docProfile']);
      },
      error: (err: { error: { message: string } }) => {
        this.messageService.add({ severity: 'error', summary: 'Login Failed', detail: err.error.message });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe()
    }
    this.layoutService.setShowHeader(true);
  }


}
