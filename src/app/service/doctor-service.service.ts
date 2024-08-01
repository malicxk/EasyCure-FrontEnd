import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, debounce } from 'rxjs';
import { environment } from '../../environments/environment';
import { docSignUpCredential, SignUpResponse, otpResponse, loginCredentials, ConsultationSlot, Doctor, Bookings, } from '../model/auth';


@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  docSignUp(formData: docSignUpCredential): Observable<SignUpResponse> {
    console.log(formData);
    return this.http.post<SignUpResponse>(`${this.apiUrl}/doctor/docSignUp`, formData);
  }

  login(formData: loginCredentials): Observable<{ token: string, doctor: string }> {
    console.log("Entered login service ");
    return this.http.post<{ token: string, doctor: string }>(`${this.apiUrl}/doctor/loginDoctor`, formData);
  }

  docVerifyOTP(otp: number): Observable<otpResponse> {
    return this.http.post<otpResponse>(`${this.apiUrl}/doctor/docOtpVerify`, { otp });
  }

  resendOTP(email: string): Observable<{ message: string, token: string }> {
    console.log("Entered resend otp doc service");

    return this.http.post<{ message: string, token: string }>(`${this.apiUrl}/doctor/docResendOTP`, { email });
  }

  forgotPassword(email: string): Observable<{ message: string, token: string }> {
    console.log("This is the service for forgotPassword");
    return this.http.post<{ message: string, token: string }>(`${this.apiUrl}/doctor/docForgPass`, { email });
  }

  forgPassverifyOTP(otp: number, token: string): Observable<otpResponse> {
    console.log('Token being passed:', token); // Log token to ensure it's not undefined
    if (!token) {
      throw new Error('Token is undefined');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<otpResponse>(`${this.apiUrl}/doctor/docForgPassVerifyOTP`, { otp }, { headers });
  }

  resetPassword(email: string, Password: string): Observable<any> {
    console.log("Entered reset password service");
    const body = { email, Password };
    return this.http.post<any>(`${this.apiUrl}/doctor/docResetPass`, body);
  }

  getDoctorProfile(): Observable<Doctor> {
    console.log("Fetching doctor profile..service.");
    return this.http.get<Doctor>(`${this.apiUrl}/doctor/docProfile`);
  }

  updateDoctorProfile(updatedData: any): Observable<any> {
    console.log("Entered update doctor service......");
    return this.http.put<any>(`${this.apiUrl}/doctor/updateDocProfile`, updatedData);
  }

  uploadProfilePhoto(file: File): Observable<any> {
    console.log("Profile photo uploading service entered........: ", file);

    const formData = new FormData();
    formData.append('profileImage', file);
    return this.http.post(`${this.apiUrl}/doctor/uploadProfilePhoto`, formData);
  }

  //consultation slots
  createConsultationSlot(slot: Partial<ConsultationSlot>): Observable<ConsultationSlot> {
    return this.http.post<ConsultationSlot>(`${this.apiUrl}/doctor/addSlots`, slot);
  }

  getConsultationSlots(): Observable<any> {
    console.log("entered in to the slot fetch service.....");
    return this.http.get(`${this.apiUrl}/doctor/consultationSlots`);
  }

  updateSlotStatus(slotId: string, isAvailable: boolean): Observable<ConsultationSlot> {
    console.log("Entered update status service");

    return this.http.put<ConsultationSlot>(`${this.apiUrl}/doctor/changeSlotStatus/${slotId}`, { isAvailable });
  }

  deleteConsultationSlot(slotId: string): Observable<void> {
    console.log("Entered slot deleting service.....");
    return this.http.delete<void>(`${this.apiUrl}/doctor/deleteSlot/${slotId}`);
  }

  getBookingsForDoctor(): Observable<Bookings[]> {
    console.log("Entered into service for virtual bookings viewing");
    return this.http.get<Bookings[]>(`${this.apiUrl}/doctor/VirtualBookings`);
  }

  uploadCertificates(files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('certificates', file); // 'certificates' is the name of the form field
    });
    return this.http.post(`${this.apiUrl}/doctor/uploadCertificates`, formData);
  }

  getUserDetailsByBookingId(bookingId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/doctor/fetchUserIdbooking/${bookingId}`);
  }

  getDoctorDetails(doctorId: string): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/doctor/docDetails/${doctorId}`);
  }

  uploadPrescription(prescriptionData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/doctor/uploadPrescription`, prescriptionData);
  }









}
