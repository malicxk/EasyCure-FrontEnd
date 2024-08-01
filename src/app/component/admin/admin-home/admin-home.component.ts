import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from '../../../service/admin.service';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { Bookings } from '../../../model/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit, OnDestroy {
  bookings: Bookings[] = [];
  chart: any;
  dashBoardSubscription!: Subscription;
  totalSlotsBooked: number = 0;
  totalRevenue: number = 0;
  virtualBookingsCount: number = 0;
  clinicalBookingsCount: number = 0;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    // Register Chart.js components
    Chart.register(...registerables);

    this.fetchBookings();
  }

  fetchBookings(): void {
    this.dashBoardSubscription = this.adminService.getBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        console.log("The fetched data is", this.bookings);

        // Calculate total slots booked and total revenue
        this.totalSlotsBooked = this.bookings.length;
        this.totalRevenue = this.bookings.reduce((acc, booking) => acc + booking.amount, 0);

        //Calculating the number of virtual and clinical slots
        this.virtualBookingsCount = this.bookings.filter(booking => booking.consultationMethod === 'Virtual').length;
        this.clinicalBookingsCount = this.bookings.filter(booking => booking.consultationMethod === 'Clinic').length;

        this.createChart();
      },
      error: (err) => {
        console.error('Error fetching bookings:', err);
      }
    });
  }

  createChart(): void {
    const bookingDates = this.bookings.map(booking => new Date(booking.payBookDate).toLocaleDateString());

    // Group bookings by day, month, and year
    const dailyBookings = this.groupBookingsBy(bookingDates, 'day');
    const monthlyBookings = this.groupBookingsBy(bookingDates, 'month');
    const yearlyBookings = this.groupBookingsBy(bookingDates, 'year');

    const completedConsultations = this.bookings.filter(booking => booking.consultationStatus).length;
    const pendingConsultations = this.bookings.filter(booking => !booking.consultationStatus).length;

    this.chart = new Chart('bookingChart', {
      type: 'bar',
      data: {
        labels: bookingDates,
        datasets: [{
          label: 'Completed Consultations',
          data: new Array(bookingDates.length).fill(completedConsultations),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }, {
          label: 'Pending Consultations',
          data: new Array(bookingDates.length).fill(pendingConsultations),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }, {
          label: 'Daily Bookings',
          data: dailyBookings,
          backgroundColor: 'rgba(54, 162, 235, 1)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }, {
          label: 'Monthly Bookings',
          data: monthlyBookings,
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
        }, {
          label: 'Yearly Bookings',
          data: yearlyBookings,
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1
        }, {
          label: 'Virtual Bookings',
          data: [this.virtualBookingsCount],
          backgroundColor: 'rgba(255, 205, 86, 1)',
          borderColor: 'rgba(255, 205, 86, 1)',
          borderWidth: 1
        }, {
          label: 'Clinical Bookings',
          data: [this.clinicalBookingsCount],
          backgroundColor: 'rgba(75, 192, 192, 1)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true, // Make the chart responsive
        maintainAspectRatio: false, // Do not maintain the aspect ratio
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  groupBookingsBy(dates: string[], period: 'day' | 'month' | 'year'): number[] {
    const periodCounts: { [key: string]: number } = {};

    dates.forEach(date => {
      let periodKey: string;
      const bookingDate = new Date(date);

      if (period === 'day') {
        periodKey = bookingDate.toLocaleDateString();
      } else if (period === 'month') {
        periodKey = `${bookingDate.getFullYear()}-${bookingDate.getMonth() + 1}`;
      } else {
        periodKey = bookingDate.getFullYear().toString();
      }

      if (!periodCounts[periodKey]) {
        periodCounts[periodKey] = 0;
      }

      periodCounts[periodKey]++;
    });

    const sortedKeys = Object.keys(periodCounts).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    return sortedKeys.map(key => periodCounts[key]);
  }

  ngOnDestroy(): void {
    if (this.dashBoardSubscription) {
      this.dashBoardSubscription.unsubscribe();
    }
  }
}
