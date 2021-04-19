import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Register } from 'src/app/model/register.model';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  error: string;
  constructor(private fb: FormBuilder, private auth: AuthService) {}

  ngOnInit(): void {
    this.intializeRegisterForm();
    this.scrollUp();
  }
  scrollUp() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
  intializeRegisterForm() {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(1)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validator: this.confirmedValidator('password', 'confirmPassword'),
      }
    );
  }
  confirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors.confirmedValidator
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
  onSubmit(data: Register) {
    this.auth.signUp(data).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        this.error = err.error.error.message;
      }
    );
  }
}
