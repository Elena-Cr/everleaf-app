// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './Services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, // for *ngIf, etc.
    RouterModule, // for <router-outlet> & routerLink
    MatButtonModule, // for mat-button in navbar
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  currentUserName = '';
  isAuthPage = false;

  constructor(private auth: AuthService, private router: Router) {}
  ngOnInit() {
    // Subscribe to authentication changes
    this.auth.currentUser$.subscribe((u) => {
      this.currentUserName = u ? u.username : '';
    });

    // Check initial route
    const currentUrl = this.router.url;
    this.isAuthPage =
      currentUrl.includes('/login') || currentUrl.includes('/register');

    // Subscribe to router events to detect auth pages
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.url;
        this.isAuthPage = url.includes('/login') || url.includes('/register');
      });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
