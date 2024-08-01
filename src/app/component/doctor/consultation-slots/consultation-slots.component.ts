import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../../service/doctor-service.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { ConsultationSlot } from '../../../model/auth';


@Component({
  selector: 'app-doctor-consultation-slots',
  templateUrl: './consultation-slots.component.html',
  styleUrls: ['./consultation-slots.component.css'],
  providers: [ConfirmationService, DatePipe] // Provider for confirmation dialog (PrimeNG)
})
export class ConsultationSlotsComponent implements OnInit {
  consultationSlots: ConsultationSlot[] = [];

  constructor(
    private doctorService: DoctorService,
    private confirmationService: ConfirmationService,
    public datePipe: DatePipe,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.fetchConsultationSlots();
  }

  fetchConsultationSlots(): void {
    console.log("Fetching consultation slots...");
    this.doctorService.getConsultationSlots()
      .subscribe({
        next: (response) => {
          const consultationSlots = response.slots;
          this.consultationSlots = consultationSlots;
        },
        error: (error) => {
          console.error('Error fetching consultation slots:', error);
        }
      });
  };

  deleteSlot(slotId: string): void {
    console.log("entered into delete slot method in the component");
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this consultation slot?',
      accept: () => {
        console.log("Entered into after modal acceptence........");
        this.doctorService.deleteConsultationSlot(slotId).subscribe({
          next: () => {
            // Remove the deleted slot from the local array
            this.consultationSlots = this.consultationSlots.filter((slot: { _id: string; }) => slot._id !== slotId);
            this.messageService.add({ severity: 'success', summary: 'Slot added', detail: 'Slot deleted successfully' });
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error deleting consultation slot', detail: error.error.message });
          }
        });
      }
    });
  }

  updateSlotStatus(slot: ConsultationSlot, newStatus: boolean): void {
    // Prevent multiple status updates at the same time
    slot.statusUpdating = true;
    this.doctorService.updateSlotStatus(slot._id, newStatus).subscribe({
      next: (updatedSlot) => {
        // Update the slot in the local array
        slot.isAvailable = newStatus;
        slot.statusUpdating = false;
        this.messageService.add({ severity: 'success', summary: 'Status Updated', detail: 'Slot status updated successfully' });
      },
      error: (error) => {
        slot.isAvailable = false;
        this.messageService.add({ severity: 'error', summary: 'Error updating slot status', detail: error.error.message });
      }
    });
  }




}

