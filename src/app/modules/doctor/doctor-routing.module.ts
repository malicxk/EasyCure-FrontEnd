import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoctorLoginComponent } from '../../component/doctor/doctor-login/doctor-login.component';
import { DoctorSignUpComponent } from '../../component/doctor/doctor-sign-up/doctor-sign-up.component';
import { DocOTPComponent } from '../../component/doctor/doc-otp/doc-otp.component';
import { DocForgPassComponent } from '../../component/doctor/doc-forg-pass/doc-forg-pass.component';
import { DocforgpassOtpComponent } from '../../component/doctor/docforgpass-otp/docforgpass-otp.component'
import { DocResetPassComponent } from '../../component/doctor/doc-reset-pass/doc-reset-pass.component';
import { DoctorHomeComponent } from '../../component/doctor/doctor-home/doctor-home.component';
import { doctorAuthGuardService } from '../../auth/authGuards/doctor-auth.guard';
import { DocVerifyGuard } from '../../auth/authGuards/doc-verify-guard.guard';
import { ConsultationSlotsComponent } from '../../component/doctor/consultation-slots/consultation-slots.component';
import { AddSlotComponent } from '../../component/doctor/add-slots/add-slots.component';
import { VirtualBookedSlotsComponent } from '../../component/doctor/virtual-booked-slots/virtual-booked-slots.component';
import { DoctorChatComponent } from '../../component/doctor/doctor-chat/doctor-chat.component';
import { DoctorVideoChatComponent } from '../../component/doctor/doctor-video-chat/doctor-video-chat.component';
import { PatientDetailsComponent } from '../../component/doctor/patient-details/patient-details.component';
import { DocCancelledBookingsComponent } from '../../component/doctor/doc-cancelled-bookings/doc-cancelled-bookings.component';

const routes: Routes = [
  { path: 'doctorLogin', component: DoctorLoginComponent },
  { path: 'doctorSignUp', component: DoctorSignUpComponent },
  { path: 'docOTP', component: DocOTPComponent },
  { path: 'docForgotPassEmail', component: DocForgPassComponent },
  { path: 'docForgotPassOTP', component: DocforgpassOtpComponent },
  { path: 'docResetPassword', component: DocResetPassComponent },
  { path: 'docProfile', component: DoctorHomeComponent, canActivate: [doctorAuthGuardService] },
  { path: 'consultationSlots', component: ConsultationSlotsComponent, canActivate: [doctorAuthGuardService, DocVerifyGuard] },
  { path: 'addConsultSlot', component: AddSlotComponent, canActivate: [doctorAuthGuardService] },
  { path: 'bookedSlots', component: VirtualBookedSlotsComponent, canActivate: [doctorAuthGuardService, DocVerifyGuard] },
  { path: 'doctorChat/:bookingId/:patientName/:slotId', component: DoctorChatComponent, canActivate: [doctorAuthGuardService] },
  { path: 'docVideoChat', component: DoctorVideoChatComponent, canActivate: [doctorAuthGuardService] },
  { path: 'patientDetails/:patientId', component: PatientDetailsComponent, canActivate: [doctorAuthGuardService] },
  { path: 'docCancelledBookings', component: DocCancelledBookingsComponent, canActivate: [doctorAuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorRoutingModule { }