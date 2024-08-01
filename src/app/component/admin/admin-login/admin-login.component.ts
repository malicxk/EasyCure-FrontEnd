import { Component, OnInit ,OnDestroy} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../../service/admin.service';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../../shared/layout.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent implements OnInit,OnDestroy {
  loginForm!: FormGroup;
  errorMessage:string|null=null;
  loginSubscription?:Subscription

  constructor(
    private formBuilder: FormBuilder,
    private adminService:  AdminService,
    private router: Router,
    private messageService: MessageService,
    private layoutService:LayoutService
  ) { }

  ngOnInit(): void {
    this.layoutService.setShowHeader(false)
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get formControls() { return this.loginForm.controls; }

  onSubmit(): void {
    if (!this.loginForm.valid) {
      this.messageService.add({ severity: 'error', summary: '', detail:"Enter your credentials"});
      return;
    }

    this.adminService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log('res',response);
        localStorage.setItem('adminToken', response.token); // Save JWT token
        this.router.navigate(['/adminHome']);
        return response.message;
      },
      error: (err) => {
        if (err.error.message) {
          this.messageService.add({ severity: 'error', summary: 'Please check your credentials', detail: err.error.message });
        } else {
          console.log('Login failed. Please check your credentials.');
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Login failed. Please check your credentials.' });
        }
      }
    });
  }
  
  ngOnDestroy(): void {
    if(this.loginSubscription){
      this.loginSubscription.unsubscribe();
    }
    this.layoutService.setShowHeader(true);
  }
}

