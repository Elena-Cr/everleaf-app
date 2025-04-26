import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plant } from '../Models/plant';

@Injectable({
  providedIn: 'root',
})
export class PlantService {
  private baseUrl: string = 'http://localhost:5234/api';

  constructor(private http: HttpClient) {}

  getPlantTypes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/planttype`);
  }

  getPlants(userId: number = 1): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/plant`, {
      params: { userId: userId.toString() },
    });
  }

  getPlantById(id: number): Observable<Plant> {
    return this.http.get<Plant>(`${this.baseUrl}/plant/${id}`);
  }

  savePlant(plantData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/plant`, plantData);
  }

  updatePlant(id: number, plantData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/plant`, plantData);
  }

  deletePlant(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/plant/${id}`);
  }
}
