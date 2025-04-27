import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, forkJoin, switchMap, of, catchError, tap } from 'rxjs';
import { Plant } from '../Models/plant';

@Injectable({
  providedIn: 'root',
})
export class PlantService {
  private baseUrl: string = 'http://localhost:5234/api';

  constructor(private http: HttpClient) {}

  getPlantTypes(): Observable<any[]> {
    console.log('Fetching plant types...');
    return this.http.get<any[]>(`${this.baseUrl}/planttype`).pipe(
      tap((types) => console.log('Plant types received:', types)),
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching plant types:', error);
        throw error;
      })
    );
  }

  getPlants(userId: number = 2): Observable<any[]> {
    console.log('Fetching plants for user:', userId);
    return this.http
      .get<any[]>(`${this.baseUrl}/plant`, {
        params: { userId: userId.toString() },
      })
      .pipe(
        tap((plants) => console.log('Plants received:', plants)),
        catchError((error: HttpErrorResponse) => {
          console.error('Error fetching plants:', error);
          throw error;
        })
      );
  }

  getPlantById(id: number): Observable<Plant> {
    console.log('Fetching plant details for ID:', id);
    return this.http.get<Plant>(`${this.baseUrl}/plant/${id}`).pipe(
      tap((plant) => console.log('Plant details received:', plant)),
      catchError((error: HttpErrorResponse) => {
        console.error(`Error fetching plant ${id}:`, error);
        throw error;
      })
    );
  }

  getPlantTypeById(id: number): Observable<any> {
    console.log('Fetching plant type:', id);
    return this.http.get<any>(`${this.baseUrl}/planttype/${id}`).pipe(
      tap((type) => console.log('Plant type received:', type)),
      catchError((error: HttpErrorResponse) => {
        console.error(`Error fetching plant type ${id}:`, error);
        throw error;
      })
    );
  }

  getPlantCareLogs(plantId: number): Observable<any[]> {
    console.log('Fetching care logs for plant:', plantId);
    return this.http
      .get<any[]>(`${this.baseUrl}/carelog/plant/${plantId}`)
      .pipe(
        tap((logs) => console.log('Care logs received:', logs)),
        catchError((error: HttpErrorResponse) => {
          console.error(
            `Error fetching care logs for plant ${plantId}:`,
            error
          );
          throw error;
        })
      );
  }

  getPlantWithDetails(plantId: number): Observable<any> {
    if (!plantId) {
      console.error('No plant ID provided to getPlantWithDetails');
      return of(null);
    }

    console.log('Fetching details for plant:', plantId);
    return this.getPlantById(plantId).pipe(
      switchMap((plant) => {
        console.log('Plant data received:', plant);
        const plantType$ = this.getPlantTypeById(plant.species);
        const careLogs$ = this.getPlantCareLogs(plantId);

        return forkJoin({
          plant: of(plant),
          plantType: plantType$,
          careLogs: careLogs$,
        }).pipe(
          tap((result) => console.log('Combined plant details:', result))
        );
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(
          `Error in getPlantWithDetails for plant ${plantId}:`,
          error
        );
        throw error;
      })
    );
  }

  savePlant(plantData: any): Observable<any> {
    console.log('Saving plant:', plantData);
    return this.http.post(`${this.baseUrl}/plant`, plantData).pipe(
      tap((response) => console.log('Plant saved:', response)),
      catchError((error: HttpErrorResponse) => {
        console.error('Error saving plant:', error);
        throw error;
      })
    );
  }

  updatePlant(id: number, plantData: any): Observable<any> {
    console.log('Updating plant:', id, plantData);
    return this.http.put(`${this.baseUrl}/plant`, plantData).pipe(
      tap((response) => console.log('Plant updated:', response)),
      catchError((error: HttpErrorResponse) => {
        console.error(`Error updating plant ${id}:`, error);
        throw error;
      })
    );
  }

  deletePlant(id: number): Observable<any> {
    console.log('Deleting plant:', id);
    return this.http.delete(`${this.baseUrl}/plant/${id}`).pipe(
      tap((response) => console.log('Plant deleted:', response)),
      catchError((error: HttpErrorResponse) => {
        console.error(`Error deleting plant ${id}:`, error);
        throw error;
      })
    );
  }
}
