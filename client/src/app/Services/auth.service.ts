// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { UserDTO, UserLoginDTO, UserRegisterDTO } from '../Models/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = 'http://localhost:5234/api/users';

  // Read any stored user from localStorage, or start as null
  private _currentUser = new BehaviorSubject<UserDTO | null>(
    JSON.parse(localStorage.getItem('currentUser') || 'null')
  );
  currentUser$ = this._currentUser.asObservable();

  constructor(private http: HttpClient) {}

  login(dto: UserLoginDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(`${this.base}/login`, dto).pipe(
      tap(user => {
        // save to BehaviorSubject AND localStorage
        this._currentUser.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
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
  }

  /** helper: get current ID or null */
  get currentUserId(): number | null {
    return this._currentUser.value?.id ?? null;
  }
}
