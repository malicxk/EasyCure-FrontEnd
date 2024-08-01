import { Component } from '@angular/core';
import { AdminService } from '../../../service/admin.service';
import { Reports } from '../../../model/auth';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {
  reports: Reports[] = []
  error: string | null = null;
  visibleCommentsModal: boolean = false;
  selectedComments: string = '';

  constructor(
    private adminService: AdminService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.adminService.getReports().subscribe({
      next: (data) => {
        this.reports = data;
        console.log("The fetched reports are", this.reports);
      },
      error: (err) => {
        console.error('Error fetching reports:', err);
        this.error = 'Could not fetch reports. Please try again later.';
      }
    });
  }

  openCommentsModal(comments: string): void {
    this.selectedComments = comments;
    this.visibleCommentsModal = true;
  }

  toggleStatus(reportId: string): void {
    this.adminService.toggleReportStatus(reportId).subscribe({
      next: (response) => {
        console.log('Report status updated successfully:', response);
        this.messageService.add({ severity: 'success', summary: 'User Notified', detail: 'Action taken successfully' });
        this.loadReports();
      },
      error: (error) => {
        console.error('Error toggling report status:', error);
      }
    });
  }




}
