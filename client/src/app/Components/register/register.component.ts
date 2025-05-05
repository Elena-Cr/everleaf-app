import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  username = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[^ ]+$/),
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
    Validators.pattern(/(?=.*\d)/),
  ]);
  email = new FormControl('', [Validators.required, Validators.email]);

  registerForm = new FormGroup({
    username: this.username,
    password: this.password,
    email: this.email,
  });

  constructor(
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // nothing extra
  }

  onSubmit() {
    if (!this.registerForm.valid) {
      this.registerForm.markAllAsTouched();
      this.snackBar.open('❌ Please fix the errors in the form.', 'Close', {
        duration: 3000,
      });
      return;
    }

    const creds = {
      username: this.username.value!,
      password: this.password.value!,
      email: this.email.value!,
    };

    this.auth
      .register(creds)
      .pipe(
        switchMap(() =>
          this.auth.login({
            username: creds.username,
            password: creds.password,
          })
        )
      )
      .subscribe({
        next: (userDto) => {
          this.snackBar.open(`✅ Welcome, ${userDto.username}!`, 'Close', {
            duration: 3500,
          });
          this.router.navigate(['/plants']);
        },
        error: (err) => {
          const msg = err.error || err.message || 'Registration failed.';
          this.snackBar.open(`❌ ${msg}`, 'Close', { duration: 4000 });
        },
      });
  }
}
