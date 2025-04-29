import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CareLog } from '../Models/care-log'; // adjust path if needed

@Injectable({
  providedIn: 'root',
})
export class CareLogService {
  private baseUrl: string = 'http://localhost:5234/api/CareLog';

  constructor(private http: HttpClient) {}

  // GET /api/CareLog
  getAllCareLogs(): Observable<CareLog[]> {
    return this.http.get<CareLog[]>(this.baseUrl);
  }

  // GET /api/CareLog/{id}
  getCareLogById(id: number): Observable<CareLog> {
    return this.http.get<CareLog>(`${this.baseUrl}/${id}`);
  }

  // GET /api/CareLog/user/{userId}
  getLogsByUserId(userId: number): Observable<CareLog[]> {
    return this.http.get<CareLog[]>(`${this.baseUrl}/user/${userId}`);
  }

  // GET /api/CareLog/plant/{plantId}
  getLogsByPlantId(plantId: number): Observable<CareLog[]> {
    return this.http.get<CareLog[]>(`${this.baseUrl}/plant/${plantId}`);
  }

  // POST /api/CareLog
  createCareLog(careLog: CareLog): Observable<any> {
    return this.http.post(this.baseUrl, careLog);
  }

  // PUT /api/CareLog
  updateCareLog(careLog: CareLog): Observable<any> {
    return this.http.put(this.baseUrl, careLog);
  }

  // DELETE /api/CareLog/{id}
  deleteCareLog(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
