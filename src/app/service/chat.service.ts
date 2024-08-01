import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;
  private peerConnection!: RTCPeerConnection;
  private config = {
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302'
      }
    ]
  };

  constructor(private http: HttpClient) {
    this.socket = io(environment.apiUrl);
  };

  connect(): void {
    this.socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });
  };

  joinRoom(roomId: string): void {
    this.socket.emit('joinRoom', roomId);
  };

  leaveRoom(roomId: string): void {
    this.socket.emit('leaveRoom', roomId);
  };

  //this is for sending text message
  sendMessage(senderId: string, receiverId: string, message: string): void {
    this.socket.emit('sendMessage', { senderId, receiverId, message });
  };

  //this is for sending audio message.
  sendAudioMessage(senderId: string, receiverId: string, audioBuffer: ArrayBuffer): void {
    this.socket.emit('audioMessage', { senderId, receiverId, audioBuffer });
  }

  // this is for receiving text messages.
  receiveMessage(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('receiveMessage', (message) => {
        observer.next(message);
      });
    });
  };

  //this is for receiving audio messages.
  receiveAudioMessage(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('receiveAudioMessage', (message) => {
        observer.next(message);
      });
    });
  }

  getMessages(senderId: string, receiverId: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/doctor/chatMessages/${senderId}/${receiverId}`);
  };


  // WebRTC related methods
  // WebRTC signaling methods
  sendOffer(offer: RTCSessionDescriptionInit, roomId: string): void {
    this.socket.emit('offer', offer, roomId);
    console.log("The offered room id is", roomId);
  };

  sendAnswer(answer: RTCSessionDescriptionInit, roomId: string): void {
    this.socket.emit('answer', answer, roomId);
    console.log("The answered room id is", roomId);
  };

  sendCandidate(candidate: RTCIceCandidate, roomId: string): void {
    this.socket.emit('candidate', candidate, roomId);
    console.log("The candidate room id is", roomId);
  };

  receiveOffer(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('offer', (offer) => {
        observer.next(offer);
      });
    });
  };

  receiveAnswer(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('answer', (answer) => {
        observer.next(answer);
      });
    });
  };

  receiveCandidate(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('candidate', (candidate) => {
        observer.next(candidate);
      });
    });
  };

}
