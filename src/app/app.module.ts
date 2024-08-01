import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';

import { UserModule } from './modules/user/user.module';
import { DoctorModule } from './modules/doctor/doctor.module';
import { AdminModule } from './modules/admin/admin.module';

//for toaster
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

//imported components
import { FooterComponent } from './footer/footer.component';
import { AppComponent } from './app.component';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptorService } from './auth/auth.interceptor';




@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
  ],

  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CommonModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(),
    ToastModule,
    ButtonModule,
    TableModule,
    CardModule,
    UserModule,
    DoctorModule,
    AdminModule,
    CalendarModule,
    DialogModule
  ],
  providers: [
    provideAnimations(), // required animations providers
    provideToastr(),
    MessageService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
    ConfirmationService
  ],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule { }
