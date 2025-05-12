import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProblemReport } from '../Models/problem-reports';

@Injectable({
  providedIn: 'root',
})
export class ProblemService {
  private baseUrl = 'http://localhost:5234/api/ProblemReport';

  constructor(private http: HttpClient) {}

  createProblem(report: ProblemReport): Observable<any> {
    return this.http.post(this.baseUrl, report);
  }

  getProblemsByPlant(plantId: number): Observable<ProblemReport[]> {
    return this.http.get<ProblemReport[]>(`${this.baseUrl}/plant/${plantId}`);
  }
  updateProblem(id: number, report: ProblemReport): Observable<any> {
    report.id = id;
    return this.http.put(this.baseUrl, report);
  }

  deleteProblem(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
