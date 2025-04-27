import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  Observable,
  forkJoin,
  switchMap,
  of,
  catchError,
  tap,
  BehaviorSubject,
} from 'rxjs';
import { Plant } from '../Models/plant';

@Injectable({
  providedIn: 'root',
})
export class PlantService {
  private baseUrl: string = 'http://localhost:5234/api';

  // Local users list
  private users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
    { id: 4, name: 'Dave' },
  ];

  // BehaviorSubject to track current user
  private currentUserSubject = new BehaviorSubject<{
    id: number;
    name: string;
  }>({
    id: 2,
    name: 'Bob',
  });

  // Observable to expose the current user
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  /** Method to change current user */
  setCurrentUserId(userId: number) {
    const user = this.users.find((u) => u.id === userId);
    if (user) {
      this.currentUserSubject.next(user);
      console.log('Switched to user:', user);
    }
  }

  /** Getter for current user's id */
  get currentUserId(): number {
    return this.currentUserSubject.value.id;
  }

  /** Get plant types */
  getPlantTypes(): Observable<any[]> {
    console.log('Fetching plant types...');
    return this.http.get<any[]>(`${this.baseUrl}/planttype`).pipe(
      tap((types) => console.log('Plant types received:', types)),
      catchError(this.handleError('fetching plant types'))
    );
  }

  /** Get plants for current user */
  getPlants(userId: number = this.currentUserId): Observable<any[]> {
    console.log('Fetching plants for user:', userId);
    return this.http
      .get<any[]>(`${this.baseUrl}/plant`, {
        params: { userId: userId.toString() },
      })
      .pipe(
        tap((plants) => console.log('Plants received:', plants)),
        catchError(this.handleError('fetching plants'))
      );
  }

  /** Get a specific plant by ID */
  getPlantById(id: number): Observable<Plant> {
    console.log('Fetching plant details for ID:', id);
    return this.http.get<Plant>(`${this.baseUrl}/plant/${id}`).pipe(
      tap((plant) => console.log('Plant details received:', plant)),
      catchError(this.handleError(`fetching plant ${id}`))
    );
  }

  /** Get plant type by ID */
  getPlantTypeById(id: number): Observable<any> {
    console.log('Fetching plant type:', id);
    return this.http.get<any>(`${this.baseUrl}/planttype/${id}`).pipe(
      tap((type) => console.log('Plant type received:', type)),
      catchError(this.handleError(`fetching plant type ${id}`))
    );
  }

  /** Get care logs for a plant */
  getPlantCareLogs(plantId: number): Observable<any[]> {
    console.log('Fetching care logs for plant:', plantId);
    return this.http
      .get<any[]>(`${this.baseUrl}/carelog/plant/${plantId}`)
      .pipe(
        tap((logs) => console.log('Care logs received:', logs)),
        catchError(this.handleError(`fetching care logs for plant ${plantId}`))
      );
  }

  /** Fetch complete plant with type and care logs */
  getPlantWithDetails(plantId: number): Observable<any> {
    if (!plantId) {
      console.error('No plant ID provided to getPlantWithDetails');
      return of(null);
    }

    console.log('Fetching full details for plant:', plantId);
    return this.getPlantById(plantId).pipe(
      switchMap((plant) => {
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
      catchError(this.handleError(`fetching details for plant ${plantId}`))
    );
  }

  /** Save new plant */
  savePlant(plantData: any): Observable<any> {
    console.log('Saving plant:', plantData);
    return this.http.post(`${this.baseUrl}/plant`, plantData).pipe(
      tap((response) => console.log('Plant saved:', response)),
      catchError(this.handleError('saving plant'))
    );
  }

  /** Update existing plant */
  updatePlant(id: number, plantData: any): Observable<any> {
    console.log('Updating plant:', id, plantData);
    return this.http.put(`${this.baseUrl}/plant`, plantData).pipe(
      tap((response) => console.log('Plant updated:', response)),
      catchError(this.handleError(`updating plant ${id}`))
    );
  }

  /** Delete plant */
  deletePlant(id: number): Observable<any> {
    console.log('Deleting plant:', id);
    return this.http.delete(`${this.baseUrl}/plant/${id}`).pipe(
      tap((response) => console.log('Plant deleted:', response)),
      catchError(this.handleError(`deleting plant ${id}`))
    );
  }

  /** Centralized error handler */
  private handleError(operation: string) {
    return (error: HttpErrorResponse) => {
      console.error(`Error during ${operation}:`, error);
      throw error;
    };
  }
}
