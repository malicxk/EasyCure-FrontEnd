import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../../../service/account.service';
import { Feedback } from '../../../model/auth';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-feedbacks',
  templateUrl: './feedbacks.component.html',
  styleUrls: ['./feedbacks.component.css']
})
export class FeedbacksComponent implements OnInit {
  doctorId!: string;
  feedbacks: Feedback[] = [];
  currentUser: any; // Store the current user
  editFeedbackForm!: FormGroup;
  feedbackToEdit: Feedback | null = null;
  editModalVisible: boolean = false;
  searchText: string = '';
  filteredFeedbacks: Feedback[] = [];
  feedbackToDelete: Feedback | null = null;
  deleteModalVisible: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private userService: AccountService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(queryParams => {
      this.doctorId = queryParams['doctorId'];
    });
    this.fetchFeedbacks();
    this.currentUser = this.userService.getCurrentUser(); // Get the current user
    this.editFeedbackForm = this.fb.group({
      comment: [''],
      rating: [0]
    });
  }

  fetchFeedbacks(): void {
    this.userService.getFeedbacksByDoctorId(this.doctorId).subscribe(
      (feedbacks) => {
        this.feedbacks = feedbacks;
        this.applySearchFilter(); // Apply search filter after fetching feedbacks
      },
      (error) => {
        console.error('Error fetching feedbacks:', error);
      }
    );
  }

  applySearchFilter(): void {
    if (this.searchText.trim() !== '') {
      this.filteredFeedbacks = this.feedbacks.filter(feedback =>
        feedback.userId.username.toLowerCase().includes(this.searchText.toLowerCase()) ||
        feedback.comment.toLowerCase().includes(this.searchText.toLowerCase())
      );
    } else {
      this.filteredFeedbacks = [...this.feedbacks];
    }
  }

  editFeedback(feedback: Feedback): void {
    this.feedbackToEdit = feedback;
    this.editFeedbackForm.patchValue({
      comment: feedback.comment,
      rating: feedback.rating
    });
    this.editModalVisible = true;
  }

  deleteFeedback(feedbackId: string): void {
    this.feedbackToDelete = this.feedbacks.find(feedback => feedback._id === feedbackId) || null;
    this.deleteModalVisible = true;
  }

  confirmDelete(): void {
    if (this.feedbackToDelete) {
      this.userService.deleteFeedback(this.feedbackToDelete._id).subscribe(() => {
        this.fetchFeedbacks();
        this.deleteModalVisible = false;
        this.feedbackToDelete = null;
      });
    }
  }

  cancelDelete(): void {
    this.deleteModalVisible = false;
    this.feedbackToDelete = null;
  }

  onSubmitEditFeedback(): void {
    if (this.feedbackToEdit) {
      const updatedFeedback = {
        ...this.feedbackToEdit,
        ...this.editFeedbackForm.value
      };
      this.userService.updateFeedback(updatedFeedback).subscribe(() => {
        this.fetchFeedbacks();
        this.editModalVisible = false;
      });
    }
  }
}