import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { UserRoutingModule } from './user-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';

import { HeaderLoginUserComponent } from '../../header-login/header-loginUser/header-login.component';
import { HeaderComponentUser } from '../../header-notlogin/header-user/header.component';
import { LoginComponent } from '../../component/user/login/login.component';
import { ForgotPasswordComponent } from '../../component/user/forgot-password/forgot-password.component';
import { SignupComponent } from '../../component/user/signup/signup.component';
import { OtpComponent } from '../../component/user/otp/otp.component';
import { UserHomeComponent } from '../../component/user/user-home/user-home.component';
import { ForgPassOtpComponent } from '../../component/user/forg-pass-otp/forg-pass-otp.component';
import { ResetPasswordComponent } from '../../component/user/reset-password/reset-password.component';
import { SpecialtyDoctorsComponent } from '../../component/user/specialty-doctors/specialty-doctors.component';
import { SlotsComponent } from '../../component/user/slot-booking/slot-booking.component';
import { PatientChatComponent } from '../../component/user/patient-chat/patient-chat.component';
import { ProfileComponent } from '../../component/user/profile/profile.component';
import { MyBookingsComponent } from '../../component/user/my-bookings/my-bookings.component';
import { SpecialtiesComponent } from '../../component/user/specialties-patient/specialties-patient.component';
import { FeedbacksComponent } from '../../component/user/feedbacks/feedbacks.component';
import { PatientVideoChatComponent } from '../../component/user/patient-video-chat/patient-video-chat.component';
import { CancelledBookingsComponent } from '../../component/user/cancelled-bookings/cancelled-bookings.component';
import { PrescriptionsComponent } from '../../component/user/prescriptions/prescriptions.component';


@NgModule({
  declarations: [
    HeaderComponentUser,
    HeaderLoginUserComponent,
    LoginComponent,
    ForgotPasswordComponent,
    SignupComponent,
    OtpComponent,
    UserHomeComponent,
    ForgPassOtpComponent,
    ResetPasswordComponent,
    SpecialtyDoctorsComponent,
    SlotsComponent,
    PatientChatComponent,
    ProfileComponent,
    MyBookingsComponent,
    SpecialtiesComponent,
    FeedbacksComponent,
    PatientVideoChatComponent,
    CancelledBookingsComponent,
    PrescriptionsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UserRoutingModule,
    TableModule,
    BrowserAnimationsModule,
    ToastrModule,
    ToastrModule.forRoot(),
    ToastModule,
    ButtonModule,
    CardModule,
    HttpClientModule,
    FileUploadModule,
    InputTextModule,
    DialogModule
  ],
  providers: [
    provideAnimations(), // required animations providers
    provideToastr(),
    MessageService
  ],
})
export class UserModule { }