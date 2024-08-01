import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { User, WalletHistory } from '../../../model/auth';
import { LayoutService } from '../../../shared/layout.service';
import { AccountService } from '../../../service/account.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  user!: User;
  walletHistory: WalletHistory[] = [];
  walletHisModal: boolean = false;
  profileSubscription!: Subscription;
  profileImageFile: File | null = null;
  medicalCertificateFile: File | null = null;
  visible: boolean = false;
  showUploadButton = false;
  userId = JSON.parse(localStorage.getItem('user')!)._id;

  @ViewChild('profileImageInput') profileImageInput!: ElementRef<HTMLInputElement>;
  @ViewChild('certificateInput') certificateInput!: ElementRef<HTMLInputElement>;

  constructor(
    private userService: AccountService,
    private layoutService: LayoutService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.fetchUserDetails();
    this.hideFooter();
  }

  fetchUserDetails() {
    this.profileSubscription = this.userService.getUserProfile(this.userId).subscribe({
      next: (user: User) => {
        if (user && user.walletHistory) {
          this.walletHistory = user.walletHistory;
        }
        this.user = user;
        console.log("The fetched user details is ", this.user);
      },
      error: (error) => {
        console.error('Error fetching user profile:', error);
      }
    });
  };

  showWalletHistory() {
    this.walletHisModal = true;
  };

  onProfileImageSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.user.profilePhoto = reader.result as string;
      };
      reader.readAsDataURL(file);
      this.profileImageFile = file;
    }
  };

  onProfileImageUpload() {
    console.log("Entered profile image uploading method");
    console.log("The user id:", this.userId);

    if (this.profileImageFile) {
      this.userService.uploadProfileImage(this.userId, this.profileImageFile).subscribe({
        next: (response) => {
          console.log("this is the response", response);
          this.messageService.add({ severity: 'success', summary: 'Upload Successful', detail: 'Profile image uploaded successfully' });
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Upload Failed', detail: 'Failed to upload profile image' });
        }
      });
    }
  };

  onMedicalCertificateSelect(event: any) {
    const file = event.target.files[0];
    this.showUploadButton = true;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.user.medCertificate = reader.result as string;
      };
      reader.readAsDataURL(file);
      this.medicalCertificateFile = file;
    }
  }

  onMedicalCertificateUpload() {
    console.log("Entered certificate uploading method..");
    if (this.medicalCertificateFile) {
      this.userService.uploadMedicalCertificate(this.userId, this.medicalCertificateFile).subscribe({
        next: (response) => {
          console.log("The response is", response);
          this.messageService.add({ severity: 'success', summary: 'Upload Successful', detail: 'Your medical certificate is saved for consultation.' });
        }
      });
    }
  };

  saveProfile() {
    console.log("Entered into save profile method.........");
    this.userService.saveUserProfile(this.userId, this.user).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.visible = false;
        this.messageService.add({ severity: 'success', summary: 'Profile Updated', detail: 'Your profile has been updated successfully.' });
      },
      error: (error) => {
        console.error('Error saving profile:', error);
        this.messageService.add({ severity: 'error', summary: 'Update Failed', detail: 'Failed to update your profile.' });
      }
    });
  };
  openFileInput() {
    this.certificateInput.nativeElement.click();
  };
  editProfile() {
    this.visible = true;
  };

  hideFooter() {
    this.layoutService.setShowFooter(false);
  };

  ngOnDestroy(): void {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }
}
