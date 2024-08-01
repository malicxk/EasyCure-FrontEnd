import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-headerlogin-admin',
  templateUrl: './headerlogin-admin.component.html',
  styleUrl: './headerlogin-admin.component.css'
})
export class HeaderloginAdminComponent {
  constructor(
    private authService:AuthService
  ){}

  logout(): void {    
    this.authService.adminlogout();
  }

}
