// src/app/components/login/login.component.ts
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
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    CommonModule,        // for *ngIf, *ngFor, etc
    FormsModule,         // for ngModel
    RouterModule,        // for routerLink
    MatFormFieldModule,  // <mat-form-field>
    MatInputModule,      // matInput
    MatButtonModule,     // mat-raised-button
  ]
})
export class LoginComponent {
  username = '';
  password = '';
  error: string|null = null;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.error = null;
    this.auth
      .login({ username: this.username, passwordHash: this.password })
      .subscribe({
        next: () => this.router.navigate(['/plants']),
        error: err => this.error = err.error || 'Login failed'
      });
  }
}
