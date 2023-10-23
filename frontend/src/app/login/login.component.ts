import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginData = {
    login: '',
    password: ''
  };

  errorMessage: string | undefined;

  constructor(private authService: AuthService, private router: Router) {}

  goToLoginPage() {
    this.router.navigate(['/login']);
  }

  goToRegisterPage() {
    this.router.navigate(['/register']);
  }

  login() {
    this.authService.login(this.loginData).subscribe(
      response => {
        console.log('Authentication response:', response);
        if (response.token) {
          this.authService.setToken(response.token);
          this.authService.setAuthenticated(true);

          const redirectUrl = this.authService.getAndClearRedirectUrl();
          this.router.navigate([redirectUrl || '/']);
        } else {
          this.errorMessage = 'Authentication failed';
        }
      },
      error => {
        if (error.status === 401) {
          const errorBody = error.error;
          this.errorMessage = errorBody.message;
        } else {
          this.errorMessage = 'Authentication error';
        }
        console.error('Authentication error:', error);
      }
    );
  }
}
