import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from '../../component/admin/admin-login/admin-login.component';
import { AdminHomeComponent } from '../../component/admin/admin-home/admin-home.component';
import { UsersListComponent } from '../../component/admin/users-list/users-list.component';
import { DoctorsListComponent } from '../../component/admin/doctors-list/doctors-list.component';
import { DoctorViewprofileComponent } from '../../component/admin/doctor-viewprofile/doctor-viewprofile.component';
import { adminAuthGuardService } from '../../auth/authGuards/admin-auth.guard';
import { SpecialtiesComponent } from '../../component/admin/specialties/specialties.component';
import { AddSpecialtyComponent } from '../../component/admin/add-specialty/add-specialty.component';
import { EditSpecialtyComponent } from '../../component/admin/edit-specialty/edit-specialty.component';
import { ReportsComponent } from '../../component/admin/reports/reports.component';

const routes: Routes = [
  { path: 'adminLogin', component: AdminLoginComponent },
  { path: 'adminHome', component: AdminHomeComponent, canActivate: [adminAuthGuardService] },
  { path: 'usersList', component: UsersListComponent, canActivate: [adminAuthGuardService] },
  { path: 'doctorsList', component: DoctorsListComponent, canActivate: [adminAuthGuardService] },
  { path: 'viewDoctor/:doctorId', component: DoctorViewprofileComponent, canActivate: [adminAuthGuardService] },
  { path: 'specialtiesList', component: SpecialtiesComponent, canActivate: [adminAuthGuardService] },
  { path: 'addSpecialty', component: AddSpecialtyComponent, canActivate: [adminAuthGuardService] },
  { path: 'viewSpecialty/:specialtyId', component: EditSpecialtyComponent, canActivate: [adminAuthGuardService] },
  { path: 'reports', component: ReportsComponent, canActivate: [adminAuthGuardService] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
