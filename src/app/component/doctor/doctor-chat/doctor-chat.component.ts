import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ChatService } from '../../../service/chat.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Bookings, ChatMessage, Reports, User } from '../../../model/auth';
import { DoctorService } from '../../../service/doctor-service.service';
import { LayoutService } from '../../../shared/layout.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../../service/account.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-doctor-chat',
  templateUrl: './doctor-chat.component.html',
  styleUrls: ['./doctor-chat.component.css']
})
export class DoctorChatComponent implements OnInit, OnDestroy {
  newMessage: string = '';
  chatMessages: ChatMessage[] = [];
  unreadMessages: ChatMessage[] = [];
  currentRoomId!: string;
  messageSubscription!: Subscription;
  senderId = JSON.parse(localStorage.getItem('doctor')!)._id;
  receiverId!: string;
  bookingId: string = '';
  slotId: string = '';
  roomId: string = '';
  bookings: Bookings[] = [];
  patientName: string = '';
  prescriptionForm!: FormGroup;
  visible: boolean = false;
  selectedReason: string = ''; // Property to hold selected reason of reporting.
  additionalComments: string = '' //for additional comments when reporting.
  visibleReportModal: boolean = false;
  uniqueBookings: Bookings[] = [];

  //audio recording properties.
  isRecording = false;
  audioChunks: any[] = [];
  mediaRecorder: any;
  audioBlob: any;


  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private doctorService: DoctorService,
    private layoutService: LayoutService,
    private fb: FormBuilder,
    private userService: AccountService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.hideFooter()//this is for hiding the footer.......
    this.loadBookings()
    this.route.params.subscribe(params => {
      this.bookingId = params['bookingId'];
      this.patientName = params['patientName'];
      this.slotId = params['slotId'];
      console.log("The sender id is", this.senderId);
      this.fetchUserDetails(this.bookingId);
      this.initializeForm();//this form is intialized for the prescrition data entry........
    });

    this.messageSubscription = this.chatService.receiveMessage().subscribe((message) => {
      if (message.senderId !== this.senderId) {
        console.log('Received message:', message);
        this.chatMessages.push(message);
      }
    });

    //this is for receiving audio message
    this.chatService.receiveAudioMessage().subscribe((message) => {
      console.log("Received audio message:", message);
      if (message.receiverId === this.senderId) {
        const audioBlob = new Blob([new Uint8Array(message.audioBuffer)], { type: 'audio/wav; codecs=opus' });
        const audioUrl = URL.createObjectURL(audioBlob);
        this.chatMessages.push({
          senderId: message.senderId,
          receiverId: message.receiverId,
          timestamp: new Date(),  // Assuming you want to add a timestamp
          _id: '',  // If there's no ID available, you can set it to an empty string or handle it as needed
          audioBuffer: message.audioBuffer,
          audioUrl: audioUrl
        });
      }
    });
  };

  fetchUserDetails(bookingId: string): void {
    this.doctorService.getUserDetailsByBookingId(bookingId)
      .subscribe(
        (data) => {
          this.receiverId = data.userId;
          console.log('The receiver id is ', this.receiverId);
          if (this.receiverId && this.senderId) {
            this.joinRoom();
            this.loadMessages();
          }
        },
        (error) => {
          console.error('Error fetching user details:', error);
        }
      );
  };

  joinRoom() {
    this.currentRoomId = this.getRoomId(this.senderId, this.receiverId);
    this.chatService.joinRoom(this.currentRoomId);
  };

  getRoomId(userId1: string, userId2: string): string {
    this.roomId = [userId1, userId2].sort().join('_');
    return this.roomId
  };

  loadMessages() {
    this.chatService.getMessages(this.senderId, this.receiverId).subscribe({
      next: (response) => {
        this.chatMessages = response;
      },
      error: (error) => {
        console.error('Error loading messages', error);
      }
    });
  };

  sendMessage() {
    if (this.newMessage.trim() && this.receiverId) {
      const newMessageObject: ChatMessage = {
        message: this.newMessage,
        senderId: this.senderId,
        receiverId: this.receiverId,
        timestamp: new Date(),
        _id: ''
      };

      this.chatService.sendMessage(this.senderId, this.receiverId, this.newMessage);
      this.newMessage = '';
      this.chatMessages.push(newMessageObject);
      this.unreadMessages.push(newMessageObject);
    }
  };

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  };

  hideFooter() {
    this.layoutService.setShowFooter(false)
  };

  startVideoCall() {
    this.router.navigate(['/docVideoChat'], { queryParams: { patientId: this.receiverId, patientName: this.patientName } });
  };

  leaveChat() {
    this.router.navigate(['/bookedSlots'])
  };

  //e-prescription uploading forms
  initializeForm(): void {
    this.prescriptionForm = this.fb.group({
      patientInfo: this.fb.group({
        name: ['', Validators.required],
        age: [null, [Validators.required, Validators.min(0)]],
        gender: ['', Validators.required]
      }),
      doctorInfo: this.fb.group({
        name: ['', Validators.required],
        contact: ['', Validators.required],
        specialization: ['', Validators.required]
      }),
      medications: this.fb.array([
        this.createMedication()
      ]),
      additionalNotes: ['']
    });
  };

  get medications(): FormArray {
    return this.prescriptionForm.get('medications') as FormArray;
  };

  createMedication(): FormGroup {
    return this.fb.group({
      drugName: ['', Validators.required],
      dosage: ['', Validators.required],
      form: ['', Validators.required],
      quantity: [null, [Validators.required, Validators.min(0)]],
      instructions: ['']
    });
  };

  addMedication() {
    this.medications.push(this.createMedication());
  };

  removeMedication(index: number) {
    this.medications.removeAt(index);
  };

  openModal() {
    this.visible = true;
  };

  closeModal() {
    this.visible = false;
  };


  uploadPrescription() {
    if (this.prescriptionForm.invalid) {
      return;
    };

    const doctorId = this.senderId;
    const patientId = this.receiverId;
    const slotId = this.slotId;

    const formData = {
      doctorId,
      patientId,
      prescriptionData: this.prescriptionForm.value,
      slotId
    };

    this.doctorService.uploadPrescription(formData).subscribe({
      next: (response) => {
        this.messageService.add({ severity: 'success', summary: 'Prescription Uploaded', detail: "Patient can download it now" });
        console.log('Prescription uploaded successfully.');
        this.visible = false;
      },
      error: (error) => {
        console.error('Failed to upload prescription.');
      }
    });
  };

  //audio recording sending methods
  startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
        this.audioChunks.push(event.data);
      };
      this.mediaRecorder.onstop = () => {
        this.audioBlob = new Blob(this.audioChunks, { type: 'audio/wav; codecs=opus' });
        this.audioChunks = [];
      };
      this.mediaRecorder.start();
      this.isRecording = true;
    });
  }

  stopRecording() {
    this.mediaRecorder.stop();
    this.audioBlob = new Blob(this.audioChunks, { type: 'audio/wav; codecs=opus' });
    this.audioChunks = [];
    this.cdr.detectChanges();
    this.isRecording = false;
  }

  sendRecording() {
    if (this.audioBlob) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(this.audioBlob);
      reader.onloadend = () => {
        if (reader.result && reader.result instanceof ArrayBuffer) {
          this.chatService.sendAudioMessage(this.senderId, this.receiverId, reader.result);
          console.log("Audio message sent successfully.");
        }
      };
      this.audioBlob = null;
    } else {
      console.error("audioBlob is null or undefined.");
    }
  };

  //for reporting patient..
  openReportModal() {
    this.visibleReportModal = true;
  };

  submitReport(): void {
    if (this.selectedReason && this.additionalComments) {
      const reportData: Reports = {
        reporterId: this.senderId,
        reportedUserId: this.receiverId,
        reporterRole: 'doctor',
        reportedUserRole: 'patient',
        reason: this.selectedReason,
        comments: this.additionalComments,
        status: false,
        createdAt: new Date,
      };

      this.userService.submitReport(reportData).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Report received', detail: "You will notified after taking action" });
          console.log('Report submitted successfully:', response);
          this.visibleReportModal = false
        },
        error: (error) => {
          console.error('Error submitting report:', error);
        }
      });
    } else {
      console.error('Please fill in all fields.');
    }
  };

  //this for loading all the bookings. //for sidebar navigation to different booked patients.
  loadBookings(): void {
    console.log("Entered into load booking method...");
    this.doctorService.getBookingsForDoctor().subscribe({
      next: (response: any) => {
        console.log("this are response", response);
        this.bookings = response.bookings
        this.uniqueBookings = this.getUniqueBookings(this.bookings);
      },
      error: (error: any) => {
        console.error('Error fetching bookings', error);
      }
    });
  };

  getUniqueBookings(bookings: Bookings[]): Bookings[] {
    const seen = new Set<string>();
    const uniqueBookings = bookings.filter(booking => {
      const isDuplicate = seen.has(booking.userId.username);
      seen.add(booking.userId.username);
      return !isDuplicate;
    });
    console.log('Unique bookings:', uniqueBookings);
    return uniqueBookings;
  }

  openChat(booking: Bookings) {
    this.router.navigate(['/doctorChat', booking._id, booking.userId.username, booking.slotId])
  };





};

