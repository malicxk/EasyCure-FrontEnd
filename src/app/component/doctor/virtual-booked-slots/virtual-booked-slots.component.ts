import { Component, OnInit, OnDestroy } from '@angular/core';
import { DoctorService } from '../../../service/doctor-service.service';
import { Subscription } from 'rxjs';
import { Bookings } from '../../../model/auth';
import { Router } from '@angular/router';
import { AccountService } from '../../../service/account.service';

@Component({
  selector: 'app-virtual-booked-slots',
  templateUrl: './virtual-booked-slots.component.html',
  styleUrl: './virtual-booked-slots.component.css'
})
export class VirtualBookedSlotsComponent implements OnInit, OnDestroy {

  bookings: Bookings[] = [];
  virtualBookingsSubs!: Subscription
  patientId: string = ''
  selectedBooking: Bookings | null = null;
  visible: boolean = false;
  visibleCancelModal: boolean = false;
  userIdToDelete: string = '';
  bookingIdToDelete: string = '';
  amountToDelete: number = 0;
  cancelledBy: string = 'Doctor';

  constructor(
    private doctorService: DoctorService,
    private router: Router,
    private userService: AccountService,
  ) { }

  ngOnInit(): void {
    this.loadBookings();
  };

  loadBookings(): void {
    console.log("Entered into load booking method...");
    this.doctorService.getBookingsForDoctor().subscribe({
      next: (response: any) => {
        console.log("this are response", response);
        this.bookings = response.bookings.filter((booking: any) => booking.bookingStatus === true);// Filter bookings where bookingStatus is true
      },
      error: (error: any) => {
        console.error('Error fetching bookings', error);
      }
    });
  };

  showCertificateModal(booking: Bookings): void {
    console.log("Entered into certificate showing method");

    // Fetch user details including certificate image
    this.userService.getUserProfile(booking.userId._id).subscribe({
      next: (user: any) => {
        console.log("This is what is receiving here", user);

        // Assign the booking with updated user details to selectedBooking
        this.selectedBooking = { ...booking, userId: user };
        this.visible = true; // Show the modal
      },
      error: (error: any) => {
        console.error('Error fetching user details', error);
      }
    });
  };

  confirmCancelBooking(userId: string, bookingId: string, amount: number): void {
    // Set the variables for canceling booking
    this.userIdToDelete = userId;
    this.bookingIdToDelete = bookingId;
    this.amountToDelete = amount;
    // Show the cancel confirmation modal
    this.visibleCancelModal = true;
  };

  // this booking status is for cancelling the booking ,when it is false it would be cancelled and money refunded to the user
  changeBookingStatus(userId: string, bookingId: string, amount: number): void {
    this.userService.cancelBookingAndUpdateWallet(userId, bookingId, amount, false, this.cancelledBy).subscribe({
      next: (response: any) => {
        console.log("Booking status updated", response);
        this.loadBookings();
      },
      error: (error: any) => {
        console.error('Error updating booking status', error);
      }
    });
  };

  viewPatientDetails(booking: Bookings) {
    const patientId = booking.userId._id;
    this.router.navigate(['/patientDetails', patientId])
  }

  openChat(booking: Bookings) {
    this.router.navigate(['/doctorChat', booking._id, booking.userId.username, booking.slotId])
  };

  ngOnDestroy(): void {
    if (this.virtualBookingsSubs) {
      this.virtualBookingsSubs.unsubscribe();
    }
  };
}
