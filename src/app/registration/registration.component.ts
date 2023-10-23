import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  user = {
    email: '',
    login: '',
    password: '',
  };

  errorMessage: string | undefined

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
  }

  goToLoginPage() {
    this.router.navigate(['/login']);
  }

  goToRegisterPage() {
    this.router.navigate(['/register']);
  }
  registerUser() {
    const requestDto = {
      login: this.user.login,
      email: this.user.email,
      password: this.user.password,
    };

    this.errorMessage = undefined


    this.http.post<any>('http://localhost:8080/register', requestDto).subscribe(
      response => {
        console.log(response);
        if (response.token) {
          this.authService.setToken(response.token);
          this.authService.setAuthenticated(true);
          this.router.navigate(['/']);
          const redirectUrl = this.authService.getAndClearRedirectUrl();
          this.router.navigate([redirectUrl || '/']);
          console.log('Redirecting to:', redirectUrl || '/');
        } else {
          this.errorMessage = 'Authentication failed';
        }
      },
      error => {
        if (error.status === 400) {
          console.log('Unprocessable Entity Error:', error.error);
          if (error.error.errors && error.error.errors.length > 0) {
            this.errorMessage = error.error.errors;
            }
        } else if (error.status === 401) {
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
