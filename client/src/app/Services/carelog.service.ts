import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CareLog } from '../Models/care-log'; // adjust path if needed

@Injectable({
  providedIn: 'root',
})
export class CareLogService {
  private baseUrl: string = 'http://localhost:5234/api/CareLog';

  constructor(private http: HttpClient) {}

  // Error handling
  private handleError(operation: string) {
    return (error: HttpErrorResponse) => {
      if (error.status === 0) {
        throw new Error(
          'Server is unreachable. Please ensure the server is running.'
        );
      } else if (error.status === 404) {
        throw new Error(`Care log not found.`);
      } else {
        throw new Error(error.error?.message || 'Unknown server error.');
      }
    };
  }

  // GET /api/CareLog
  getAllCareLogs(): Observable<CareLog[]> {
    return this.http
      .get<CareLog[]>(this.baseUrl)
      .pipe(catchError(this.handleError('getAllCareLogs')));
  }

  // GET /api/CareLog/{id}
  getCareLogById(id: number): Observable<CareLog> {
    return this.http
      .get<CareLog>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError('getCareLogById')));
  }

  // GET /api/CareLog/user/{userId}
  getLogsByUserId(userId: number): Observable<CareLog[]> {
    return this.http
      .get<CareLog[]>(`${this.baseUrl}/user/${userId}`)
      .pipe(catchError(this.handleError('getLogsByUserId')));
  }

  // GET /api/CareLog/plant/{plantId}
  getLogsByPlantId(plantId: number): Observable<CareLog[]> {
    return this.http
      .get<CareLog[]>(`${this.baseUrl}/plant/${plantId}`)
      .pipe(catchError(this.handleError('getLogsByPlantId')));
  }

  // POST /api/CareLog
  createCareLog(careLog: CareLog): Observable<any> {
    return this.http
      .post(this.baseUrl, careLog)
      .pipe(catchError(this.handleError('createCareLog')));
  }

  // PUT /api/CareLog
  updateCareLog(careLog: CareLog): Observable<any> {
    return this.http
      .put(this.baseUrl, careLog)
      .pipe(catchError(this.handleError('updateCareLog')));
  }

  // DELETE /api/CareLog/{id}
  deleteCareLog(id: number): Observable<any> {
    return this.http
      .delete(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError('deleteCareLog')));
  }
}
