import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plant } from '../Models/plant';

@Injectable({
  providedIn: 'root'
})
export class PlantService {
  getPlantTypes(): Observable<any[]> | undefined {
    return this.http.get<string[]>(`${this.baseUrl}/api/planttype`);
  }
  private baseUrl: string = "http://localhost:5234"; // Adjust as needed
  constructor(private http: HttpClient) {}

  getPlants(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/api/plant`); // Adjust as needed
  }
  
  savePlant(plantData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/plant`, plantData); // or PUT for edit
  }

  deletePlant(id: number): Observable<any> {
    return this.http.delete(`/api/plants/${id}`); // Adjust as needed
  }

  updatePlant(id: number, plantData: any): Observable<any> {
    return this.http.put(`/api/plants/${id}`, plantData); // Adjust as needed
  }

  getPlantById(id: number): Observable<Plant> {
    return this.http.get<Plant>(`${this.baseUrl}/${id}`);
  }
}
