import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ConsultationSlot, Reports, Specialty, Subscription, adminLoginResponse } from '../model/auth';
import { User } from '../model/auth';
import { Doctor } from '../model/auth';


@Injectable({
  providedIn: 'root'
})

export class AdminService {


  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(credentials: { email: string; password: string }): Observable<adminLoginResponse> {
    return this.http.post<adminLoginResponse>(`${this.apiUrl}/admin/loginAdmin`, credentials);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/admin/userList`);
  }

  updateUserStatus(userId: string, isBlocked: boolean): Observable<any> {
    console.log("Entered updateStatus Service");
    return this.http.put<any>(`${this.apiUrl}/admin/updateStatus/${userId}`, { isBlocked });
  }

  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}/admin/doctorsList`);
  }

  getDoctorsPagination(page: number, limit: number, searchQuery: string = '', specialty: string = ''): Observable<{ doctors: Doctor[], totalDoctors: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    if (searchQuery) {
      params = params.set('searchQuery', searchQuery);
    }
    if (specialty) {
      params = params.set('specialty', specialty);
    }
    return this.http.get<{ doctors: Doctor[], totalDoctors: number }>(`${this.apiUrl}/admin/doctorsList`, { params });
  }

  updateDoctorStatus(doctorId: string, isBlocked: boolean): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/admin/updateDocStatus/${doctorId}`, { isBlocked });
  }

  getDoctorById(doctorId: string): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/admin/viewDoctor/${doctorId}`);
  }

  verifyDoctor(doctorId: string, isVerified: boolean): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/admin/verifyDoctor/${doctorId}`, { isVerified });
  }

  getSpecialties(): Observable<Specialty[]> {
    return this.http.get<Specialty[]>(`${this.apiUrl}/admin/specialtyList`);
  }

  addSpecialty(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/addSpecialty`, formData);
  }

  updateSpecialty(specialtyId: string, isDocAvailable: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/updateSpecialtyStatus/${specialtyId}`, { isDocAvailable });
  }

  deleteSpecialty(specialtyId: string): Observable<any> {
    console.log("the id that is sending throught the service is", specialtyId);

    return this.http.delete(`${this.apiUrl}/admin/deleteSpecialty/${specialtyId}`);
  }

  getSpecialtyById(specialtyId: string): Observable<Specialty> {
    return this.http.get<Specialty>(`${this.apiUrl}/admin/viewSpecialty/${specialtyId}`);
  }

  editSpecialty(specialtyId: string, formData: FormData): Observable<any> {
    console.log("entered the service of edit specialty");
    return this.http.put(`${this.apiUrl}/admin/editSpecialty/${specialtyId}`, formData);
  }


  getDoctorsBySpecialty(specialtyName: string): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}/admin/specialtyDocts/${specialtyName}`);
  }

  getAllSubscriptions(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(this.apiUrl);
  }

  createSubscription(subscription: Subscription): Observable<Subscription> {
    return this.http.post<Subscription>(this.apiUrl, subscription);
  }

  //this is for change booking status into booked......
  updateSlotStatus(slotId: string, isBooked: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/bookingStatus/${slotId}`, { isBooked });
  }

  getBookings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/dashBoardBookings`);
  }

  getSpecialtiesPaginated(search: string, page: number, limit: number): Observable<{ specialties: Specialty[], total: number }> {
    return this.http.get<{ specialties: Specialty[], total: number }>(`${this.apiUrl}/admin/specialtyList`, {
      params: { search, page: page.toString(), limit: limit.toString() }
    });
  }

  getReports(): Observable<Reports[]> {
    return this.http.get<Reports[]>(`${this.apiUrl}/admin/reports`);
  }

  toggleReportStatus(reportId: string): Observable<Reports> {
    return this.http.put<Reports>(`${this.apiUrl}/admin/updateReportStatus/${reportId}`, {});
  }


}
