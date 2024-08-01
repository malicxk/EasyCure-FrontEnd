import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from '../../../service/admin.service';
import { User } from '../../../model/auth';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css',
  providers: [DatePipe]
})
export class UsersListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  fetchSubscription?: Subscription
  constructor(
    private adminService: AdminService,
    private router: Router,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.adminService.getUsers().subscribe({
      next: (users: User[]) => {
        this.users = users;
        console.log(users);
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
  }

  updateUserStatus(user: User, newStatus: boolean): void {
    // Set statusUpdating to true to disable the buttons
    user.statusUpdating = true;
    this.adminService.updateUserStatus(user._id, newStatus).subscribe({
      next: () => {
        // Update the user's status locally
        user.isBlocked = newStatus;
        // Reset statusUpdating to false when the operation completes
        user.statusUpdating = false;
      },
      error: (error: any) => {
        console.error('Error updating user status:', error);
        // Reset statusUpdating to false if there's an error
        user.statusUpdating = false;
      }
    });
  }

  formatDOB(dateOfBirth: Date): string {
    return this.datePipe.transform(dateOfBirth, 'dd/MM/yyyy') || '';
  }

  ngOnDestroy(): void {
    if (this.fetchSubscription) {
      this.fetchSubscription.unsubscribe();
    }
  }
}









