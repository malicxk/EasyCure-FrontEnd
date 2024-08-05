import { Component, OnInit, NgZone } from '@angular/core';
import { AccountService } from '../../../service/account.service';
import { ConsultationSlot, Doctor, Specialty, User } from '../../../model/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../service/admin.service';
import { MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';

declare var Razorpay: any;

@Component({
  selector: 'app-slot-booking',
  templateUrl: './slot-booking.component.html',
  styleUrls: ['./slot-booking.component.css']
})
export class SlotsComponent implements OnInit {
  confirmationVisible: boolean = false;
  doctorId: string = "";
  doctor: Doctor[] = [];
  slots: ConsultationSlot[] = [];
  specialtyId: string = '';
  consultationMethod: string = '';
  consultationStatus: boolean = false;
  specialtyAmount?: any;
  specialtyName?: string;
  paymentId: string | null = null;
  booked: boolean = false;
  userId = JSON.parse(localStorage.getItem('user')!)._id;
  selectedSlotId!: string;
  selectedSlotDate!: string;
  selectedSlotStartTime!: string;
  user!: User;

  constructor(
    private userService: AccountService,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router,
    private _ngZone: NgZone,
    private messageService: MessageService,
  ) { };

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.doctorId = params['doctorId']; // Get the doctorId from route params
      this.consultationMethod = params['consultationMethod'];//captured consultation method..
      this.fetchSlotsForDoctor(this.doctorId);
    });
    //this is for specialtyId
    this.route.queryParams.subscribe(queryParams => {
      this.specialtyId = queryParams['specialtyId'];
      this.fetchSpecialtyAmount(this.specialtyId);
    });
    this.fetchUserDetails(this.userId)
  };

  fetchSlotsForDoctor(doctorId: string): void {
    this.userService.getSlotsForDoctor(doctorId, this.consultationMethod).subscribe(
      (slots) => {
        this.slots = slots
        // filter(slot => !slot.isBooked);
        console.log("The fetched slots are", this.slots);
      },
      (error) => {
        console.error('Error fetching slots:', error);
      }
    );
  };

  fetchSpecialtyAmount(specialtyId: string): void {
    console.log("Entered into amount fetch method");
    this.adminService.getSpecialtyById(specialtyId).subscribe(
      (specialty: Specialty) => {
        this.specialtyAmount = specialty.amount;
        this.specialtyName = specialty.specialtyName;
        console.log('Specialty Amount:', this.specialtyAmount);
      },
      (error) => {
        console.error('Error fetching specialty:', error);
      }
    );
  };

  bookSlot(slotId: string, slotDate: string, startTime: string): void {
    const razorPayOptions = {
      currency: 'INR',
      amount: this.specialtyAmount * 100,
      name: 'EasyCure',
      key: environment.RAZORPAY_KEY,
      theme: {
        color: '#3b28fe'
      },
      modal: {
        ondismiss: () => { }
      },
      handler: (response: any) => {
        if (response) {
          if (response.razorpay_payment_id) {
            this.handlePaymentSuccess(response.razorpay_payment_id, slotId, slotDate, startTime, true);
          }
        }
      }
    };

    const rzp = new (window as any).Razorpay(razorPayOptions);
    rzp.open();
  };

  handlePaymentSuccess(paymentId: string, slotId: string, slotDate: string, startTime: string, isBooked: boolean): void {
    const userId = JSON.parse(localStorage.getItem('user')!)._id;
    this.userService.bookSlot(paymentId, this.specialtyId, userId, slotId, this.doctorId, slotDate, startTime, this.specialtyAmount, this.consultationStatus, this.consultationMethod, true).subscribe({
      next: (successResponse: any) => {
        this.paymentId = paymentId;
        this.updateSlotStatus(slotId, isBooked);
        this.booked = true;
        this.fetchSlotsForDoctor(this.doctorId);
        this._ngZone.run(() => {
          this.messageService.add({ severity: 'success', summary: 'Slot booked', detail: "Now you can chat with doctor" });
          this.router.navigate(['/myBookings']);
        });
      },
      error: (error: any) => {
        this.messageService.add({ severity: 'error', summary: 'Failed', detail: error.error });
      }
    });
  };

  openConfirmationDialog(slotId: string, slotDate: string, slotStartTime: string): void {
    this.selectedSlotId = slotId;
    this.selectedSlotDate = slotDate;
    this.selectedSlotStartTime = slotStartTime;
    this.confirmationVisible = true;
  }

  confirmBooking(): void {
    this.bookSlotWithWalletMoney(this.selectedSlotId, this.selectedSlotDate, this.selectedSlotStartTime);
    this.confirmationVisible = false;
  }

  bookSlotWithWalletMoney(slotId: string, slotDate: string, slotStartTime: string): void {
    if (!this.user || !this.user.walletMoney) {
      this.fetchUserDetails(this.userId);
    }

    // Once user details are fetched, check the wallet balance
    this.userService.getUserProfile(this.userId).subscribe({
      next: (response) => {
        this.user = response;
        if (this.user.walletMoney < this.specialtyAmount) {
          this.messageService.add({ severity: 'error', summary: 'Insufficient Balance', detail: 'Check your wallet balance' });
        } else {
          this.userService.bookSlotWithWallet(this.specialtyId, this.userId, slotId, this.doctorId, slotDate, slotStartTime, this.specialtyAmount, this.consultationStatus, this.consultationMethod, true).subscribe({
            next: (response: any) => {
              this.updateSlotStatus(slotId, true);
              this.fetchSlotsForDoctor(this.doctorId);
              this.messageService.add({ severity: 'success', summary: 'Slot booked', detail: "your consultation request received by doctor" });
            },
            error: (error: any) => {
              this.messageService.add({ severity: 'error', summary: 'Failed', detail: error.error });
            }
          });
        }
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Unable to fetch user details' });
      }
    });
  };

  updateSlotStatus(slotId: string, isBooked: boolean): void {
    this.adminService.updateSlotStatus(slotId, isBooked).subscribe({
      next: (response) => {
        this.messageService.add({ severity: 'success', summary: 'check my slots for status', detail: "Slot booked now you can chat" });
        this.router.navigate(['/myBookings']);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      }
    });
  }

  fetchUserDetails(userId: string): void {
    this.userService.getUserProfile(userId).subscribe({
      next: (response) => {
        this.user = response;
        console.log('User details fetched successfully', this.user);
      },
      error: (error) => {
        console.error('Error fetching user details', error);
      }
    });
  }

  ChatWithDoctor() {
    this.router.navigate(['/patientChat'], { queryParams: { doctorId: this.doctorId } });
  }

  goToSpecialtyDoctors() {
    this.router.navigate(['/specialtyDoctors'])
  }

  goToDoctorFeedbacks() {
    this.router.navigate(['/feedbacks'], { queryParams: { doctorId: this.doctorId } })
  }


}


