import { Component } from '@angular/core';
import { Bookings } from '../../../model/auth';
import { AccountService } from '../../../service/account.service';
import { MessageService } from 'primeng/api';
import { LayoutService } from '../../../shared/layout.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css']
})
export class MyBookingsComponent {

  bookings: Bookings[] = [];
  userId = JSON.parse(localStorage.getItem('user')!)._id;
  showCancelDialog = false;
  bookingToCancel: Bookings | null = null;
  cancelledBy: string = 'Patient'

  constructor(
    private userService: AccountService,
    private messageService: MessageService,
    private _layoutService: LayoutService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this._layoutService.setShowFooter(true);
    this.fetchBookings();
  }

  fetchBookings(): void {
    this.userService.getUserBookings(this.userId).subscribe({
      next: (data) => {
        this.bookings = data.filter(booking => booking.bookingStatus);  // Only show bookings with status true
      },
      error: (err) => {
        console.error('Error fetching bookings', err);
      }
    });
  };

  showCancelConfirmation(booking: Bookings): void {
    this.bookingToCancel = booking;
    this.showCancelDialog = true;
  };

  cancelBooking(booking: Bookings | null): void {
    if (booking) {
      const amount = booking.amount;
      this.userService.cancelBookingAndUpdateWallet(this.userId, booking._id, amount, false, this.cancelledBy).subscribe({
        next: (response) => {
          console.log('Booking cancelled and wallet updated:', response);
          this.fetchBookings();  // Refresh bookings after cancellation
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Booking cancelled and wallet updated successfully' });
        },
        error: (err) => {
          console.error('Error cancelling booking and updating wallet', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to cancel booking or update wallet' });
        }
      });
    }
    this.showCancelDialog = false; // Close the modal after handling cancellation
  };

  ChatWithDoctor(doctorId: string) {
    this.router.navigate(['/patientChat'], { queryParams: { doctorId: doctorId } });
  }


}