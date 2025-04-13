import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CareLog {
  action: string;
  date: string;
  notes?: string;
  plantId: number;
}

@Injectable({
  providedIn: 'root',
})
export class CareLogService {
  private baseUrl = 'http://localhost:5234/api/carelogs'; // update with real endpoint

  constructor(private http: HttpClient) {}

  createCareLog(careLog: CareLog): Observable<any> {
    return this.http.post(this.baseUrl, careLog);
  }
}
