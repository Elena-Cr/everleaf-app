import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserDTO, UserLoginDTO, UserRegisterDTO } from '../Models/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = 'http://localhost:5234/api/users';
  private readonly AUTH_CREDENTIALS_KEY = 'authCredentials';

  private _currentUser = new BehaviorSubject<UserDTO | null>(
    JSON.parse(localStorage.getItem('currentUser') || 'null')
  );
  currentUser$ = this._currentUser.asObservable();

  constructor(private http: HttpClient) {
    this.checkExistingAuth();
  }
  private checkExistingAuth(): void {
    const storedUser = localStorage.getItem('currentUser');
    const storedCredentials = localStorage.getItem(this.AUTH_CREDENTIALS_KEY);

    if (storedUser && storedCredentials) {
      try {
        const user = JSON.parse(storedUser);
        // Check if we have a valid user object before setting the current user
        if (user && user.id && user.username) {
          this._currentUser.next(user);
        } else {
          this.logout();
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        this.logout();
      }
    } else {
      // Ensure we start with null user state
      this._currentUser.next(null);
    }
  }

  login(dto: UserLoginDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(`${this.base}/login`, dto).pipe(
      tap((user) => {
        const credentials = btoa(`${dto.username}:${dto.password}`);

        this._currentUser.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user));

        localStorage.setItem(this.AUTH_CREDENTIALS_KEY, credentials);
      })
    );
  }

  register(dto: UserRegisterDTO): Observable<any> {
    return this.http.post(`${this.base}/register`, dto);
  }
  logout(): void {
    this._currentUser.next(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem(this.AUTH_CREDENTIALS_KEY);
  }

  get currentUserId(): number | null {
    return this._currentUser.value?.id ?? null;
  }

  get currentAuthCredentials(): string | null {
    return localStorage.getItem(this.AUTH_CREDENTIALS_KEY);
  }
}
