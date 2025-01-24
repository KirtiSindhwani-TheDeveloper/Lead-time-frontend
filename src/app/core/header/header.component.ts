import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PrimengModule } from '../../shared/primeng/primeng.module';

@Component({
  selector: 'app-header',
  imports: [PrimengModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  items: any;
  constructor(private authService: AuthService) { }

  ngOnInit() {
      this.items = [
          
          {
              label: 'Log Out',
              icon: 'pi pi-sign-out',
              command: () => this.onLogout()
          },
          {
              separator: true
          },
          
        ]
      }
  onLogout(): void {
    this.authService.logout();  // Call logout from AuthService
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated(); // Check if user is authenticated
  }
}
