import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DoctorService } from '../../../service/doctor-service.service';
import { ConsultationSlot } from '../../../model/auth';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-slots',
  templateUrl: './add-slots.component.html',
  styleUrls: ['./add-slots.component.css']
})
export class AddSlotComponent {
  addSlotForm: FormGroup;
  errorMessage: string | null = null;
  today!: Date;

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.addSlotForm = this.fb.group({
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      consultationMethod: ['Virtual', Validators.required],
      isDefault: [true]
    });
    this.today = new Date();
  };

  onSubmit(): void {
    if (this.addSlotForm.valid) {
      const isDefault = this.addSlotForm.value.isDefault;
      const slot: Partial<ConsultationSlot> = {
        date: this.addSlotForm.value.date,
        startTime: this.addSlotForm.value.startTime,
        consultationMethod: this.addSlotForm.value.consultationMethod,
        isDefault: isDefault
      };
      this.doctorService.createConsultationSlot(slot).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Slot added', detail: response.message });
          setTimeout(() => {
            this.router.navigate(['/consultationSlots']);
          }, 2000)
        },
        error: (error: any) => {
          this.messageService.add({ severity: 'error', summary: 'Slot already exists', detail: "Failed to create slot" });
          console.error('Error creating consultation slot:', error);

        }
      });
    }
  };



}
