// src/app/components/register/register.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { CommonModule }        from '@angular/common';
import { FormsModule }         from '@angular/forms';
import { RouterModule }        from '@angular/router';
import { MatFormFieldModule }  from '@angular/material/form-field';
import { MatInputModule }      from '@angular/material/input';
import { MatButtonModule }     from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatFormFieldModule,   // <-- for <mat-form-field>
    MatInputModule,       // <-- for matInput
    MatButtonModule       // <-- for mat-raised-button
  ]
})
export class RegisterComponent {
  username = '';
  password = '';
  email = '';
  error: string|null = null;
form: any;
model: any;

  constructor(
    private auth: AuthService, 
    private router: Router, 
    private snackBar: MatSnackBar) 
  {}

  onSubmit() {
    this.error = null;
    this.auth
      .register({
        username: this.username,
        passwordHash: this.password,
        email: this.email 
      })
      .subscribe({
        next: () => this.router.navigate(['/login']),
        error: err => this.error = err.error || 'Registration failed'
      });
  }
}
