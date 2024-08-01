import { Component } from '@angular/core';
import { DoctorService } from '../../../service/doctor-service.service';
import { Bookings } from '../../../model/auth';

@Component({
  selector: 'app-doc-cancelled-bookings',
  templateUrl: './doc-cancelled-bookings.component.html',
  styleUrl: './doc-cancelled-bookings.component.css'
})
export class DocCancelledBookingsComponent {
  bookings: Bookings[] = [];
  doctorId = JSON.parse(localStorage.getItem('doctor')!)._id;

  constructor(
    private doctorService: DoctorService
  ) { };

  ngOnInit(): void {
    this.loadBookings();
  };

  loadBookings(): void {
    console.log("Entered into load booking method...");
    this.doctorService.getBookingsForDoctor().subscribe({
      next: (response: any) => {
        console.log("this are response", response);
        this.bookings = response.bookings.filter((booking: any) => booking.bookingStatus === false);// Filter bookings where bookingStatus is false
      },
      error: (error: any) => {
        console.error('Error fetching bookings', error);
      }
    });
  };
}
