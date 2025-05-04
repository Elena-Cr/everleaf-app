// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { UserDTO, UserLoginDTO, UserRegisterDTO } from '../Models/user';
// import { btoa } from 'buffer'; // Use built-in btoa for browsers

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = 'http://localhost:5234/api/users';
  private readonly AUTH_CREDENTIALS_KEY = 'authCredentials'; // Key for localStorage

  // Read any stored user from localStorage, or start as null
  private _currentUser = new BehaviorSubject<UserDTO | null>(
    JSON.parse(localStorage.getItem('currentUser') || 'null')
  );
  currentUser$ = this._currentUser.asObservable();

  constructor(private http: HttpClient) {}

  login(dto: UserLoginDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(`${this.base}/login`, dto).pipe(
      tap((user) => {
        // Encode credentials using browser's btoa
        const credentials = btoa(`${dto.username}:${dto.passwordHash}`); // Base64 encode username:password
        // save user to BehaviorSubject AND localStorage
        this._currentUser.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        // save encoded credentials to localStorage
        localStorage.setItem(this.AUTH_CREDENTIALS_KEY, credentials);
      })
    );
  }

  register(dto: UserRegisterDTO): Observable<any> {
    return this.http.post(`${this.base}/register`, dto);
  }

  logout(): void {
    // clear both BehaviorSubject and localStorage
    this._currentUser.next(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem(this.AUTH_CREDENTIALS_KEY); // Clear credentials
  }

  /** helper: get current ID or null */
  get currentUserId(): number | null {
    return this._currentUser.value?.id ?? null;
  }

  /** helper: get stored basic auth credentials or null */
  get currentAuthCredentials(): string | null {
    return localStorage.getItem(this.AUTH_CREDENTIALS_KEY);
  }
}
