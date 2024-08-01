import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-header-loginUser',
  templateUrl: './header-login.component.html',
  styleUrls: ['./header-login.component.css']
})
export class HeaderLoginUserComponent {
  isCollapsed = true;
  constructor(
    private authService: AuthService
  ) { }

  toggleNavbar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  logout(): void {
    console.log("Entered logout user home");
    this.authService.userlogout();
  }
}
