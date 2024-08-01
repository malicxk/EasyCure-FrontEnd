import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from '../../component/user/login/login.component';
import { ForgotPasswordComponent } from '../../component/user/forgot-password/forgot-password.component';
import { SignupComponent } from '../../component/user/signup/signup.component';
import { OtpComponent } from '../../component/user/otp/otp.component';
import { UserHomeComponent } from '../../component/user/user-home/user-home.component';
import { ForgPassOtpComponent } from '../../component/user/forg-pass-otp/forg-pass-otp.component';
import { ResetPasswordComponent } from '../../component/user/reset-password/reset-password.component';
import { userAuthGuardService } from '../../auth/authGuards/userAuth.guard';
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


const routes: Routes = [
  { path: 'login', component: LoginComponent, },
  { path: 'forgot-password', component: ForgotPasswordComponent, },
  { path: 'signup', component: SignupComponent, },
  { path: 'otp', component: OtpComponent, },
  { path: 'userHome', component: UserHomeComponent, canActivate: [userAuthGuardService] },
  { path: 'forgotPassEmail', component: ForgotPasswordComponent, },
  { path: 'forgotPassOTP', component: ForgPassOtpComponent, },
  { path: 'resetPassword', component: ResetPasswordComponent, },
  { path: 'specialtyDoctors/:specialtyName/:specialtyId', component: SpecialtyDoctorsComponent, canActivate: [userAuthGuardService] },
  { path: 'bookSlot/:doctorId/:consultationMethod', component: SlotsComponent, canActivate: [userAuthGuardService] },
  { path: 'patientChat', component: PatientChatComponent, canActivate: [userAuthGuardService] },
  { path: 'userProfile', component: ProfileComponent, canActivate: [userAuthGuardService] },
  { path: 'myBookings', component: MyBookingsComponent, canActivate: [userAuthGuardService] },
  { path: 'specialties', component: SpecialtiesComponent, canActivate: [userAuthGuardService] },
  { path: 'feedbacks', component: FeedbacksComponent, canActivate: [userAuthGuardService] },
  { path: 'patientVideoChat/:doctorName', component: PatientVideoChatComponent, canActivate: [userAuthGuardService] },
  { path: 'cancelledBookings', component: CancelledBookingsComponent, canActivate: [userAuthGuardService] },
  { path: 'prescriptions', component: PrescriptionsComponent, canActivate: [userAuthGuardService] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
