import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChatService } from '../../../service/chat.service';
import { Bookings } from '../../../model/auth';
import { DoctorService } from '../../../service/doctor-service.service';
import { LayoutService } from '../../../shared/layout.service';

@Component({
  selector: 'app-doctor-video-chat',
  templateUrl: './doctor-video-chat.component.html',
  styleUrl: './doctor-video-chat.component.css'
})
export class DoctorVideoChatComponent {
  isMicOn = true;
  isCameraOn = true;
  bookings: Bookings[] = [];
  uniqueBookings: Bookings[] = [];
  patientName: string = '';
  senderId!: string;
  receiverId!: string;
  currentRoomId!: string;
  peerConnection: RTCPeerConnection | null = null;
  localStream!: MediaStream;
  config = {
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302'
      }
    ]
  };
  private messageSubscription!: Subscription;
  private offerSubscription!: Subscription;
  private answerSubscription!: Subscription;
  private candidateSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private router: Router,
    private doctorService: DoctorService,
    private layoutService: LayoutService
  ) { }

  ngOnInit(): void {
    this.hideFooter()
    this.loadBookings()
    this.route.queryParams.subscribe(params => {
      this.receiverId = params['patientId'];
      this.patientName = params['patientName'];
      this.senderId = JSON.parse(localStorage.getItem('doctor')!)._id;
      this.joinRoom();
    });

    this.offerSubscription = this.chatService.receiveOffer().subscribe(async (offer) => {
      if (this.peerConnection) {
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);
        this.chatService.sendAnswer(answer, this.currentRoomId);
      }
    });

    this.answerSubscription = this.chatService.receiveAnswer().subscribe(async (answer) => {
      if (this.peerConnection) {
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    this.candidateSubscription = this.chatService.receiveCandidate().subscribe(async (candidate) => {
      if (this.peerConnection) {
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });
  };

  ngOnDestroy(): void {
    this.messageSubscription?.unsubscribe();
    this.offerSubscription?.unsubscribe();
    this.answerSubscription?.unsubscribe();
    this.candidateSubscription?.unsubscribe();
    this.chatService.leaveRoom(this.currentRoomId);
  };

  joinRoom() {
    this.currentRoomId = this.getRoomId(this.senderId, this.receiverId);
    this.chatService.joinRoom(this.currentRoomId);
  };

  getRoomId(userId1: string, userId2: string): string {
    return [userId1, userId2].sort().join('_');
  };

  async startCall() {
    this.createPeerConnection();
    try {
      // Request local media stream
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      console.log('Local stream obtained:', stream);

      this.localStream = stream;
      stream.getTracks().forEach(track => this.peerConnection!.addTrack(track, stream));

      const localVideo: HTMLVideoElement = document.getElementById('localVideo') as HTMLVideoElement;
      localVideo.srcObject = stream;

      // Create offer and send it to the other peer
      const offer = await this.peerConnection!.createOffer();
      console.log('Generated offer:', offer);

      await this.peerConnection!.setLocalDescription(offer);
      console.log('Set local description for offer');

      this.chatService.sendOffer(this.peerConnection!.localDescription!, this.currentRoomId);
    } catch (error) {
      console.error('Error starting call:', error);
    }
  };

  async answerCall() {
    this.createPeerConnection();
  };

  createPeerConnection() {
    this.peerConnection = new RTCPeerConnection(this.config);

    this.peerConnection.onicecandidate = ({ candidate }) => {
      if (candidate) {
        this.chatService.sendCandidate(candidate, this.currentRoomId);
      }
    };

    this.peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams;
      const remoteVideo: HTMLVideoElement = document.getElementById('remoteVideo') as HTMLVideoElement;
      if (remoteVideo) {
        remoteVideo.srcObject = remoteStream;
      }
    };

    // Get local media stream and add tracks to peer connection
    const localVideo: HTMLVideoElement = document.getElementById('localVideo') as HTMLVideoElement;
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        this.localStream = stream;
        stream.getTracks().forEach(track => this.peerConnection!.addTrack(track, stream));
        localVideo.srcObject = stream;
      })
      .catch((error) => {
        console.error('Error accessing media devices:', error);
      });
  };

  endCall() {
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;

      // Stop all tracks in the local stream
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => track.stop());
      }

      const localVideo: any = document.getElementById('localVideo');
      localVideo.srcObject = null;

      const remoteVideo: any = document.getElementById('remoteVideo');
      remoteVideo.srcObject = null;

      this.chatService.leaveRoom(this.currentRoomId);
    }
  };

  toggleCamera() {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      this.isCameraOn = videoTrack.enabled;
    }
  };

  toggleMic() {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      this.isMicOn = audioTrack.enabled;
    }
  }

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

  hideFooter() {
    this.layoutService.setShowFooter(false);
  }


};
