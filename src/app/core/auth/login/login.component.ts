import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Login } from 'src/app/model/login.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SocialAuthService } from 'angularx-social-login';
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
} from 'angularx-social-login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  error: string;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private authService: SocialAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.intializeLoginForm();
    this.scrollUp();
  }
  scrollUp() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
  intializeLoginForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((res) => {
      this.auth.googleSignIn(res.idToken).subscribe((res) => {
        this.router.navigate(['/']);
      });
    });
  }

  onSubmit(data: Login) {
    this.auth.signIn(data).subscribe(
      (res) => {
        this.router.navigate(['/']);
      },
      (err) => {
        this.error = err.error.error.message;
      }
    );
  }
}
