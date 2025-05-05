import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }     from '@angular/material/input';
import { MatButtonModule }    from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[^ ]+$/)
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
    Validators.pattern(/(?=.*\d)/)
  ]);

  loginForm = new FormGroup({
    username: this.username,
    password: this.password,
  });

  constructor(
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onSubmit() {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      this.snackBar.open('❌ Please fix the errors in the form.', 'Close', {
        duration: 3000,
      });
      return;
    }

    const creds = {
      username: this.username.value!,
      passwordHash: this.password.value!
    };

    this.auth.login(creds).subscribe({
      next: user => {
        this.snackBar.open(`✅ Welcome back, ${user.username}!`, 'Close', {
          duration: 3000,
        });
        this.router.navigate(['/plants']);
      },
      error: err => {
        const msg = err.error || err.message || 'Login failed.';
        this.snackBar.open(`❌ ${msg}`, 'Close', { duration: 4000 });
      }
    });
  }
}
