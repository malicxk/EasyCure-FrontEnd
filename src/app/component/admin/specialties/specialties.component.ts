import { Component, OnInit, OnDestroy } from '@angular/core';
import { Specialty } from '../../../model/auth';
import { AdminService } from '../../../service/admin.service';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-specialties',
  templateUrl: './specialties.component.html',
  styleUrl: './specialties.component.css'
})
export class SpecialtiesComponent implements OnInit, OnDestroy {
  specialties: Specialty[] = [];
  loading: boolean = true;
  specialtySubscription?: Subscription
  showDeleteConfirmDialog: boolean = false;
  specialtyToDelete?: Specialty;

  constructor(
    private adminService: AdminService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.adminService.getSpecialties().subscribe(
      (data: Specialty[]) => {
        this.specialties = data;
        this.loading = false;
      },
      error => {
        console.error('Error fetching specialties', error);
        this.loading = false;
      }
    );
  }

  updateSpecialtyStatus(specialty: Specialty, newStatus: boolean) {
    specialty.isDocAvailable = newStatus;
    this.adminService.updateSpecialty(specialty._id, newStatus).subscribe(
      response => {
        this.messageService.add({
          severity: 'success', summary: 'Success', detail: `Specialty ${specialty.specialtyName} is now ${newStatus ? 'Available' : 'Not Available'}.`
        });
      },
      error => {
        console.error('Error updating specialty status', error);
        this.messageService.add({
          severity: 'error', summary: 'Error', detail: 'Failed to update specialty status. Please try again later.'
        });
      }
    );
  }

  viewSpecialty(specialtyId: string) {
    this.router.navigate(['/viewSpecialty', specialtyId]);
  }

  promptDeleteSpecialty(specialty: Specialty) {
    this.specialtyToDelete = specialty;
    this.showDeleteConfirmDialog = true;
  }

  confirmDelete() {
    if (this.specialtyToDelete) {
      this.adminService.deleteSpecialty(this.specialtyToDelete._id).subscribe(
        () => {
          this.specialties = this.specialties.filter(s => s._id !== this.specialtyToDelete!._id);
          this.messageService.add({
            severity: 'success', summary: 'Success', detail: `Specialty ${this.specialtyToDelete?.specialtyName} has been deleted.`
          });
          this.specialtyToDelete = undefined;
          this.showDeleteConfirmDialog = false;
        },
        error => {
          console.error('Error deleting specialty', error);
          this.messageService.add({
            severity: 'error', summary: 'Error', detail: 'Failed to delete specialty. Please try again later.'
          });
          this.specialtyToDelete = undefined;
          this.showDeleteConfirmDialog = false;
        }
      );
    }
  }

  ngOnDestroy(): void {
    if (this.specialtySubscription) {
      this.specialtySubscription.unsubscribe();
    }
  }

}
