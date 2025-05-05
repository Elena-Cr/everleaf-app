// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './Services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,       // for *ngIf, etc.
    RouterModule,       // for <router-outlet> & routerLink
    MatButtonModule     // for mat-button in navbar
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currentUserName = '';

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.auth.currentUser$.subscribe(u => {
      this.currentUserName = u ? u.username : '';
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
