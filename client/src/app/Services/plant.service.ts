import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';  // Observable = special object that will give the data LATER

@Injectable({
  providedIn: 'root'
})
export class PlantService {

  constructor(private http: HttpClient) {}

  // 🌱 Get ALL plants
  // Observable<any[]> means: "I will send you a list of plants later (when the server replies)"
  getPlants(): Observable<any[]> {
    return this.http.get<any[]>('your-api-url/plants');  // Replace 'your-api-url/plants' with your real URL!
  }

  // 🌿 Get ONE specific plant by ID
  // Observable<any> means: "I will send you ONE plant's data later"
  getPlantById(id: string): Observable<any> {
    // Right now, we return fake data instantly for testing
    return of({
      id: id,
      name: 'Example Plant',
      species: 'Example Species',
      plantedDate: '2025-04-26',
      location: 'Greenhouse 1',
      careLogs: ['Watered yesterday', 'Checked for bugs today'],
    });
  }
}

