import { Component } from '@angular/core';
import { AccountService } from '../../../service/account.service';
import { Bookings } from '../../../model/auth';


@Component({
  selector: 'app-cancelled-bookings',
  templateUrl: './cancelled-bookings.component.html',
  styleUrl: './cancelled-bookings.component.css'
})
export class CancelledBookingsComponent {

  bookings: Bookings[] = [];
  userId = JSON.parse(localStorage.getItem('user')!)._id;

  constructor(
    private userService: AccountService,
  ) { }

  ngOnInit(): void {
    this.fetchBookings();
  }

  fetchBookings(): void {
    this.userService.getUserBookings(this.userId).subscribe({
      next: (data) => {
        this.bookings = data.filter(booking => !booking.bookingStatus)
      },
      error: (err) => {
        console.error('Error fetching bookings', err);
      }
    });
  };
}
