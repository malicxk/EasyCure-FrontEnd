import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { AdminRoutingModule } from './admin-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';
import { CalendarModule } from 'primeng/calendar';

import { HeaderAdminComponent } from '../../header-notlogin/header-admin/header-admin.component';
import { HeaderloginAdminComponent } from '../../header-login/headerlogin-admin/headerlogin-admin.component';
import { AdminLoginComponent } from '../../component/admin/admin-login/admin-login.component';
import { AdminHomeComponent } from '../../component/admin/admin-home/admin-home.component';
import { UsersListComponent } from '../../component/admin/users-list/users-list.component';
import { DoctorsListComponent } from '../../component/admin/doctors-list/doctors-list.component';
import { DoctorViewprofileComponent } from '../../component/admin/doctor-viewprofile/doctor-viewprofile.component';
import { SpecialtiesComponent } from '../../component/admin/specialties/specialties.component';
import { AddSpecialtyComponent } from '../../component/admin/add-specialty/add-specialty.component';
import { EditSpecialtyComponent } from '../../component/admin/edit-specialty/edit-specialty.component';
import { SubscriptionComponent } from '../../component/admin/subscription/subscription.component';
import { ReportsComponent } from '../../component/admin/reports/reports.component';


@NgModule({
  declarations: [
    HeaderAdminComponent,
    HeaderloginAdminComponent,
    AdminLoginComponent,
    AdminHomeComponent,
    UsersListComponent,
    DoctorsListComponent,
    DoctorViewprofileComponent,
    SpecialtiesComponent,
    AddSpecialtyComponent,
    EditSpecialtyComponent,
    SubscriptionComponent,
    ReportsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    TableModule,
    BrowserAnimationsModule,
    ToastrModule,
    ToastModule,
    ButtonModule,
    CardModule,
    HttpClientModule,
    FileUploadModule,
    DialogModule,
    CalendarModule
  ],
  providers: [
    provideAnimations(), // required animations providers
    provideToastr(),
    MessageService
  ],
})
export class AdminModule { }