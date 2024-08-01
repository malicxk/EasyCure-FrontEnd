import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginResponse, SignUpResponse, ResendResponse, loginCredentials, signUpCredential, otpResponse, ConsultationSlot, User, Bookings, Doctor, Prescription, Feedback, Reports } from '../model/auth';


@Injectable({
  providedIn: 'root'
})

export class AccountService {

  private apiUrl = environment.apiUrl;
  private isLogged$ = new BehaviorSubject<boolean>(false);
  private isAdmin$ = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient) { }
  isAuthenticated(): Observable<boolean> {
    return of(true);
  }

  // Sign Up User
  signUp(formData: signUpCredential): Observable<SignUpResponse> {
    console.log(formData);
    return this.http.post<SignUpResponse>(`${this.apiUrl}/user/signUp`, formData);
  }

  verifyOTP(otp: number): Observable<otpResponse> {  //////hrerererere
    return this.http.post<otpResponse>(`${this.apiUrl}/user/otpVerify`, { otp });
  }

  resendOTP(email: string): Observable<{ message: string, token: string }> {
    return this.http.post<{ message: string, token: string }>(`${this.apiUrl}/user/resendOtp`, { email });
  }

  login(formData: loginCredentials): Observable<{ token: any, user: any }> {
    console.log("Entered login service ");
    return this.http.post<{ token: any, user: any }>(`${this.apiUrl}/user/loginUser`, formData);
  }

  forgotPassword(email: string): Observable<{ message: string, token: string }> {
    console.log("This is the service for forgotPassword");
    return this.http.post<{ message: string, token: string }>(`${this.apiUrl}/user/forgotPassword`, { email });
  }

  forgPassverifyOTP(otp: number): Observable<otpResponse> {
    return this.http.post<otpResponse>(`${this.apiUrl}/user/forgPassOTPverfiy`, { otp },);
  }

  resetPassword(email: string, Password: string): Observable<any> {
    const body = { email, Password };
    return this.http.post<any>(`${this.apiUrl}/user/resetPassWord`, body);
  }

  refreshToken(refreshToken: string): Observable<{ accessToken: string, refreshToken: string }> {
    return this.http.post<{ accessToken: string, refreshToken: string }>(`${this.apiUrl}/user/refresh-token`, { refreshToken });
  }

  //slots functionalities.........
  getSlotsForDoctor(doctorId: string, consultationMethod?: string): Observable<ConsultationSlot[]> {
    console.log("Fetching slots for doctor with id:", doctorId, "and consultation method:", consultationMethod);
    let url = `${this.apiUrl}/user/getSlotsByDoc/${doctorId}`;
    // If consultationMethod is provided, add it as a query parameter
    if (consultationMethod) {
      const params = new HttpParams().set('consultationMethod', consultationMethod);
      url += `?${params.toString()}`;
    }
    return this.http.get<ConsultationSlot[]>(url);
  }

  bookSlot(paymentId: string, specialtyId: string, userId: string, slotId: string, doctorId: string, slotDate: string, startTime: string, amount: number, consultationStatus: boolean, consultationMethod: string, bookingStatus: boolean): Observable<any> {
    const requestBody = { paymentId: paymentId, specialtyId: specialtyId, userId: userId, slotId, startTime, doctorId: doctorId, slotDate: slotDate, amount: amount, consultationStatus, consultationMethod, bookingStatus };
    return this.http.post(`${this.apiUrl}/user/bookSlot`, requestBody);
  }

  getUserProfile(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user/userProfile/${userId}`);
  }

  uploadProfileImage(userId: string, profileImageFile: File): Observable<User> {
    const formData: FormData = new FormData();
    formData.append('UprofileImage', profileImageFile, profileImageFile.name);
    formData.append('userId', userId);
    return this.http.post<User>(`${this.apiUrl}/user/uploadProfileImage`, formData);
  }

  uploadMedicalCertificate(userId: string, medicalCertificateFile: File): Observable<User> {
    const formData: FormData = new FormData();
    formData.append('medicalCertificate', medicalCertificateFile, medicalCertificateFile.name);
    formData.append('userId', userId);
    return this.http.post<User>(`${this.apiUrl}/user/uploadMedCertificate`, formData);
  }

  // for editing username and dob
  saveUserProfile(userId: string, updatedData: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/user/editProfile/${userId}`, updatedData);
  }

  getUserBookings(userId: string): Observable<Bookings[]> {
    return this.http.get<Bookings[]>(`${this.apiUrl}/user/myBookings/${userId}`);
  }

  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}/user/doctors`);
  }

  //booking slot cancelling and refund functionalities...........
  cancelBookingAndUpdateWallet(userId: string, bookingId: string, amount: number, newStatus: boolean, cancelledBy: string): Observable<any> {
    const body = { userId, bookingId, amount, newStatus, cancelledBy };
    return this.http.post<any>(`${this.apiUrl}/user/cancelBooking`, body);
  }

  bookSlotWithWallet(specialtyId: string, userId: string, slotId: string, doctorId: string, slotDate: string, startTime: string, amount: number, consultationStatus: boolean, consultationMethod: string, bookingStatus: boolean): Observable<any> {
    const requestBody = { specialtyId: specialtyId, userId: userId, slotId, startTime, doctorId: doctorId, slotDate: slotDate, amount: amount, consultationStatus, consultationMethod, bookingStatus };
    return this.http.post(`${this.apiUrl}/user/walletBook`, requestBody);
  }

  //for prescription download by patient that uploaded by the doctor
  getPrescriptionsByPatientId(patientId: string): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(`${this.apiUrl}/user/prescriptionDetails/${patientId}`);
  }

  downloadPrescription(prescriptionId: string) {
    return this.http.get(`${this.apiUrl}/user/downloadPrescription/${prescriptionId}`, { responseType: 'blob' });
  };

  //for providing feedback
  addFeedback(doctorId: string, feedback: Feedback): Observable<Feedback> {
    console.log("entered into service for feedback......");
    return this.http.post<Feedback>(`${this.apiUrl}/user/patientFeedback/${doctorId}`, feedback);
  }

  getFeedbacksByDoctorId(doctorId: string, searchText?: string): Observable<Feedback[]> {
    let url = `${this.apiUrl}/user/getPatientFeedbacks/${doctorId}`;
    if (searchText) {
      url += `?searchText=${searchText}`;
    }
    return this.http.get<Feedback[]>(url);
  }

  updateFeedback(feedback: Feedback): Observable<Feedback> {
    console.log("entered into update feedback service...");

    return this.http.put<Feedback>(`${this.apiUrl}/user/editFeedback/${feedback._id}`, feedback);
  }

  deleteFeedback(feedbackId: string): Observable<Feedback> {
    return this.http.delete<Feedback>(`${this.apiUrl}/user/deleteFeedback/${feedbackId}`);
  }

  getCurrentUser(): any {
    return JSON.parse(localStorage.getItem('user')!);
  }

  submitReport(reportData: Reports): Observable<Reports> {
    return this.http.post<Reports>(`${this.apiUrl}/admin/submitReport`, reportData);
  }










}
