import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private authService: AuthService) { }

  onLogout(): void {
    this.authService.logout();  // Call logout from AuthService
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated(); // Check if user is authenticated
  }
}
