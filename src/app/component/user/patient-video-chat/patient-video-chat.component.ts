import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../../../service/chat.service';
import { Subscription } from 'rxjs';
import { DoctorService } from '../../../service/doctor-service.service';
import { LayoutService } from '../../../shared/layout.service';

@Component({
  selector: 'app-patient-video-chat',
  templateUrl: './patient-video-chat.component.html',
  styleUrls: ['./patient-video-chat.component.css']
})
export class PatientVideoChatComponent implements OnInit, OnDestroy {
  isMicOn = true;
  isCameraOn = true;
  doctorName: string = '';
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
    private layoutService: LayoutService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.hideFooter()
    this.route.params.subscribe(params => {
      this.doctorName = params['doctorName'];
    });
    this.route.queryParams.subscribe(params => {
      this.receiverId = params['doctorId'];
      this.senderId = JSON.parse(localStorage.getItem('user')!)._id;
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

  hideFooter() {
    this.layoutService.setShowFooter(false);
  }

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
    // Request local media stream
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      this.localStream = stream;
      stream.getTracks().forEach(track => this.peerConnection!.addTrack(track, stream));

      const localVideo: HTMLVideoElement = document.getElementById('localVideo') as HTMLVideoElement;
      localVideo.srcObject = stream;

      // Create offer and send it to the other peer
      const offer = await this.peerConnection!.createOffer();
      await this.peerConnection!.setLocalDescription(offer);
      this.chatService.sendOffer(this.peerConnection!.localDescription!, this.currentRoomId);
    } catch (error) {
      console.error('Error accessing media devices:', error);
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
      console.log("remote video", remoteVideo);
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
      this.backToChat()
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

  backToChat() {
    this.router.navigate(['/patientChat'], { queryParams: { doctorId: this.receiverId } });
  }


}


