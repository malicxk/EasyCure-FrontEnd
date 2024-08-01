import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-headerlogin-doctor',
  templateUrl: './headerlogin-doctor.component.html',
  styleUrl: './headerlogin-doctor.component.css'
})
export class HeaderloginDoctorComponent {
  constructor(
    private authService:AuthService
  ){}

  logout(): void {    
    this.authService.doctorlogout();
  }

}
