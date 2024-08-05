import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChatService } from '../../../service/chat.service';
import { Bookings, ChatMessage, Doctor, Prescription } from '../../../model/auth'; // Adjust this path based on your actual project structure
import { LayoutService } from '../../../shared/layout.service';
import { DoctorService } from '../../../service/doctor-service.service';
import { AccountService } from '../../../service/account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Reports } from '../../../model/auth';
import { MessageService } from 'primeng/api';



@Component({
  selector: 'app-patient-chat',
  templateUrl: './patient-chat.component.html',
  styleUrls: ['./patient-chat.component.css'] // Adjust styling as per your design requirements
})
export class PatientChatComponent implements OnInit, OnDestroy {
  navigateToBookingPage() {
    throw new Error('Method not implemented.');
  }

  visible: boolean = false;
  newMessage: string = '';
  chatMessages: ChatMessage[] = [];
  unreadMessages: ChatMessage[] = [];
  senderId = JSON.parse(localStorage.getItem('user')!)._id;
  receiverId: string = '';
  roomId: string = '';
  currentRoomId!: string;
  messageSubscription!: Subscription;
  doctor!: Doctor
  prescription: Prescription[] = [];
  feedbackForm!: FormGroup;
  selectedReason: string = ''; // Property to hold selected reason of reporting.
  additionalComments: string = '' //for additional comments when reporting.
  visibleReportModal: boolean = false;
  bookings: Bookings[] = [];


  //recording stuffs
  isRecording = false;
  audioChunks: any[] = [];
  mediaRecorder: any;
  audioBlob: any;


  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private layoutService: LayoutService,
    private doctorService: DoctorService,
    private userService: AccountService,
    private fb: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService
  ) {
    this.feedbackForm = this.fb.group({
      comment: ['', Validators.required],
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      userId: [''],
      doctorId: ['']
    });
  };

  ngOnInit(): void {
    this.hideFooter()//just hiding the footer....
    this.route.queryParams.subscribe(params => {
      this.receiverId = params['doctorId'];
      this.loadMessages();
      this.fetchDoctorDetails()
      this.joinRoom();
      this.fetchPrescriptions()
    });
    // Subscribe to incoming messages
    this.messageSubscription = this.chatService.receiveMessage().subscribe((message) => {
      if (message.senderId !== this.senderId) {
        console.log('Received message:', message);
        this.chatMessages.push(message);
      }
    });

    //this is for receiving audio message.
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

  joinRoom() {
    this.currentRoomId = this.getRoomId(this.senderId, this.receiverId);
    this.chatService.joinRoom(this.currentRoomId);
  };

  // Method to get unique roomId based on senderId and receiverId
  getRoomId(userId1: string, userId2: string): string {
    console.log("user1", userId1);
    console.log("user2", userId2);
    this.roomId = [userId1, userId2].sort().join('_');
    return this.roomId
  };

  // Method to send a new message
  sendMessage() {
    if (this.newMessage.trim() && this.receiverId) {
      const newMessageObject: ChatMessage = {
        message: this.newMessage,
        senderId: this.senderId,
        receiverId: this.receiverId,
        timestamp: new Date(),
        _id: ''
      };

      // Call chatService method to send message
      this.chatService.sendMessage(this.senderId, this.receiverId, this.newMessage);
      this.newMessage = ''; // Clear input after sending message
      this.chatMessages.push(newMessageObject); // Add sent message to chatMessages array
      this.unreadMessages.push(newMessageObject);
    }
  };

  // Method to load existing chat messages
  loadMessages() {
    this.chatService.getMessages(this.senderId, this.receiverId).subscribe({
      next: (response) => {
        console.log("These are messages!!!", response);
        this.chatMessages = response; // Load messages into chatMessages array
      },
      error: (error) => {
        console.error('Error loading messages:!!!', error);
      }
    });
  };

  fetchDoctorDetails() {
    this.doctorService.getDoctorDetails(this.receiverId).subscribe({
      next: (doctor: Doctor) => {
        this.doctor = doctor;
        console.log("The fetched doctor details are:", this.doctor);
      },
      error: (error) => {
        console.error('Error fetching doctor profile:', error);
      }
    });
  };

  startVideoCall(doctorName: string) {
    this.router.navigate(['/patientVideoChat', doctorName], { queryParams: { doctorId: this.receiverId } })
  };

  leaveChat() {
    throw new Error('Method not implemented.');
  };

  hideFooter(): void {
    this.layoutService.setShowFooter(false);
  };

  //for prescription download functionalitieees.......
  fetchPrescriptions(): void {
    this.userService.getPrescriptionsByPatientId(this.senderId).subscribe({
      next: (data: Prescription[]) => {
        this.prescription = data;
        console.log('Fetched prescriptions:', this.prescription);
      },
      error: (error) => console.error('Error fetching prescriptions:', error)
    });
  };

  downloadPrescription(prescriptionId: string) {
    console.log("Downloading prescription with ID:", prescriptionId);
    this.userService.downloadPrescription(prescriptionId).subscribe(
      (response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'E-prescription.pdf';
        link.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error downloading prescription:', error);
      }
    );
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

  //this is for providing feedbacks by patient to doctor
  openFeedbackModal() {
    this.feedbackForm.patchValue({
      doctorId: this.receiverId,
      userId: this.senderId
    });
    this.visible = true;
  };

  saveFeedback() {
    if (this.feedbackForm.valid) {
      this.userService.addFeedback(this.receiverId, this.feedbackForm.value).subscribe({
        next: response => {
          this.messageService.add({ severity: 'success', summary: 'Thanks for your valuable feedback', detail: "You can see your feedback in the feedbacks" });
          console.log('Feedback added successfully', response);
          this.visible = false;
        },
        error: error => {
          console.error('Error adding feedback:', error);
        },
        complete: () => {
          console.log('Feedback submission completed');
        }
      });
    }
  };

  openReportModal() {
    this.visibleReportModal = true;
  };

  submitReport(): void {
    if (this.selectedReason && this.additionalComments) {
      const reportData: Reports = {
        reporterId: this.senderId,
        reportedUserId: this.receiverId,
        reporterRole: 'patient',
        reportedUserRole: 'doctor',
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

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  };
}
