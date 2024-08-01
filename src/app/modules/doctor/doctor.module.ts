import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DoctorRoutingModule } from './doctor-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { HttpClientModule } from '@angular/common/http';
import { AvatarModule } from 'primeng/avatar';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { CarouselModule } from 'primeng/carousel';


import { HeaderDoctorComponent } from '../../header-notlogin/header-doctor/header-doctor.component';
import { HeaderloginDoctorComponent } from '../../header-login/headerlogin-doctor/headerlogin-doctor.component';
import { DoctorSignUpComponent } from '../../component/doctor/doctor-sign-up/doctor-sign-up.component';
import { DoctorLoginComponent } from '../../component/doctor/doctor-login/doctor-login.component';
import { DocOTPComponent } from '../../component/doctor/doc-otp/doc-otp.component';
import { DocForgPassComponent } from '../../component/doctor/doc-forg-pass/doc-forg-pass.component';
import { DocforgpassOtpComponent } from '../../component/doctor/docforgpass-otp/docforgpass-otp.component';
import { DocResetPassComponent } from '../../component/doctor/doc-reset-pass/doc-reset-pass.component';
import { DoctorHomeComponent } from '../../component/doctor/doctor-home/doctor-home.component';
import { ConsultationSlotsComponent } from '../../component/doctor/consultation-slots/consultation-slots.component';
import { AddSlotComponent } from '../../component/doctor/add-slots/add-slots.component';
import { VirtualBookedSlotsComponent } from '../../component/doctor/virtual-booked-slots/virtual-booked-slots.component';
import { DoctorChatComponent } from '../../component/doctor/doctor-chat/doctor-chat.component';
import { DoctorVideoChatComponent } from '../../component/doctor/doctor-video-chat/doctor-video-chat.component';
import { PatientDetailsComponent } from '../../component/doctor/patient-details/patient-details.component';
import { DocCancelledBookingsComponent } from '../../component/doctor/doc-cancelled-bookings/doc-cancelled-bookings.component';



@NgModule({
  declarations: [
    HeaderDoctorComponent,
    HeaderloginDoctorComponent,
    DoctorSignUpComponent,
    DoctorLoginComponent,
    DocOTPComponent,
    DocForgPassComponent,
    DocforgpassOtpComponent,
    DocResetPassComponent,
    DoctorHomeComponent,
    ConsultationSlotsComponent,
    AddSlotComponent,
    VirtualBookedSlotsComponent,
    DoctorChatComponent,
    DoctorVideoChatComponent,
    PatientDetailsComponent,
    DocCancelledBookingsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DoctorRoutingModule,
    TableModule,
    BrowserAnimationsModule,
    ToastrModule,
    ToastModule,
    ButtonModule,
    CardModule,
    HttpClientModule,
    AvatarModule,
    CalendarModule,
    DialogModule,
    ConfirmDialogModule,
    PaginatorModule,
    DropdownModule,
    CarouselModule,
  ],
  providers: [
    provideAnimations(), // required animations providers
    provideToastr(),
    MessageService,
    ConfirmationService
  ]
})
export class DoctorModule { }