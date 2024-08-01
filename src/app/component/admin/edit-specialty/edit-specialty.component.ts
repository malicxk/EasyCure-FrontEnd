import { Component, OnInit,OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../service/admin.service';
import { Specialty } from '../../../model/auth';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-specialty',
  templateUrl: './edit-specialty.component.html',
  styleUrls: ['./edit-specialty.component.css']
})
export class EditSpecialtyComponent implements OnInit,OnDestroy{
  specialty: Specialty = {
    specialtyName: '',
    specialtyImage: null,
    isDocAvailable: true,
    amount:null,
    _id: '',
    doctors: []
  };
  imageUrl!: string | ArrayBuffer | null;
  speciatlyEditSubs?:Subscription;

  constructor(
    private adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    const specialtyId = this.route.snapshot.paramMap.get('specialtyId');
    if (specialtyId) {
      this.adminService.getSpecialtyById(specialtyId).subscribe(
        (data: Specialty) => {
          this.specialty = data;
          this.imageUrl = data.specialtyImage as string | ArrayBuffer | null;
        },
        error => {
          console.error('Error fetching specialty', error);
        }
      );
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.specialty.specialtyImage = file;

    const reader = new FileReader();
    reader.onload = e => this.imageUrl = reader.result;
    reader.readAsDataURL(file);
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('specialtyName', this.specialty.specialtyName);
    if (this.specialty.specialtyImage) {
      formData.append('specialtyImage', this.specialty.specialtyImage);
    }
    formData.append('isDocAvailable', String(this.specialty.isDocAvailable));
    if (this.specialty.amount !== null) {
      formData.append('amount', String(this.specialty.amount));
    }

    this.adminService.editSpecialty(this.specialty._id, formData).subscribe(
      (response) => {
        this.messageService.add({severity: 'success',summary: 'Specialty Edited',detail :response.message});
        setTimeout(()=>{
          this.router.navigate(['/specialtiesList']);
        },2000)
      },
      error => {
        this.messageService.add({severity: 'error',summary: 'Not edited anything',detail :error.error.message});
        console.error('Error updating specialty', error);
      }
    );
  }

  ngOnDestroy(): void {
    if(this.speciatlyEditSubs){
      this.speciatlyEditSubs.unsubscribe();
    }
  }
}