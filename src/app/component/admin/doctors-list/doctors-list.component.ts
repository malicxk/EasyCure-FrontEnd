import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Doctor } from '../../../model/auth';
import { Subscription } from 'rxjs';
import { AdminService } from '../../../service/admin.service';

@Component({
  selector: 'app-doctors-list',
  templateUrl: './doctors-list.component.html',
  styleUrls: ['./doctors-list.component.css']
})
export class DoctorsListComponent implements OnInit, OnDestroy {

  doctors: Doctor[] = [];
  currentPage: number = 1; // Current page number
  itemsPerPage: number = 7; // Number of items per page
  totalDoctors: number = 0; // Total number of doctors
  searchQuery: string = ''; // Search query input

  fetchSubscription?: Subscription;

  constructor(
    private adminService: AdminService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.fetchDoctors();
  }

  fetchDoctors(): void {
    this.adminService.getDoctorsPagination(this.currentPage, this.itemsPerPage, this.searchQuery).subscribe({
      next: (data: { doctors: Doctor[], totalDoctors: number }) => {
        this.doctors = data.doctors;
        this.totalDoctors = data.totalDoctors;
        console.log("Fetched doctors:", this.doctors);
        console.log("Total doctors:", this.totalDoctors);
      },
      error: (error: any) => {
        console.error('Error fetching doctors:', error);
      }
    });
  }

  // Method to change page
  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.fetchDoctors(); // Fetch new data for the new page
  }

  updateUserStatus(doctor: Doctor, newStatus: boolean): void {
    // Set statusUpdating to true to disable the buttons
    doctor.statusUpdating = true;
    this.adminService.updateDoctorStatus(doctor._id, newStatus).subscribe({
      next: () => {
        // Update the user's status locally
        doctor.isBlocked = newStatus;
        // Reset statusUpdating to false when the operation completes
        doctor.statusUpdating = false;
      },
      error: (error: any) => {
        console.error('Error updating user status:', error);
        // Reset statusUpdating to false if there's an error
        doctor.statusUpdating = false;
      }
    });
  }

  viewDoctorProfile(doctor: Doctor) {
    this.router.navigate(['/viewDoctor', doctor._id]);
  }

  ngOnDestroy(): void {
    if (this.fetchSubscription) {
      this.fetchSubscription.unsubscribe();
    }
  }

  onSearchChange(): void {
    this.currentPage = 1; // Reset to first page on search
    this.fetchDoctors();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.currentPage = 1; // Reset to first page on clear search
    this.fetchDoctors();
  }

  totalPages(): number[] {
    const pages = Array(Math.ceil(this.totalDoctors / this.itemsPerPage)).fill(0).map((x, i) => i + 1);
    console.log("Total pages:", pages);
    return pages;
  }
}