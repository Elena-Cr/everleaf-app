import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  Observable,
  BehaviorSubject,
  of,
  forkJoin,
  switchMap,
  catchError,
  tap,
  retry,
  map,
} from 'rxjs';
import { Plant } from '../Models/plant';
import { PlantType } from '../Models/plant-type';
import { ProblemReport } from '../Models/problem-reports';

@Injectable({
  providedIn: 'root',
})
export class PlantService {
  private baseUrl: string = 'http://localhost:5234/api';

  // Dummy user list
  private users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
    { id: 4, name: 'Dave' },
  ];

  // BehaviorSubject to track the currently logged in user
  private currentUserSubject = new BehaviorSubject<{
    id: number;
    name: string;
  }>({
    id: 2,
    name: 'Bob',
  });

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  /** Change current user */
  setCurrentUserId(userId: number) {
    const user = this.users.find((u) => u.id === userId);
    if (user) {
      this.currentUserSubject.next(user);
      console.log('Switched to user:', user);
    }
  }

  /** Get current user ID */
  get currentUserId(): number {
    return this.currentUserSubject.value.id;
  }

  /** Fetch plant types */
  getPlantTypes(): Observable<PlantType[]> {
    console.log('Fetching plant types from:', `${this.baseUrl}/planttype`);
    return this.http.get<PlantType[]>(`${this.baseUrl}/planttype`).pipe(
      tap((types) => {
        console.log(
          'Raw plant types received:',
          JSON.stringify(types, null, 2)
        );
        if (!types || types.length === 0) {
          console.warn('No plant types returned from server');
        } else {
          console.log('First plant type:', types[0]);
        }
      }),
      map((types) => {
        // Ensure proper casing of properties
        return types.map((type) => ({
          ...type,
          commonName: type.CommonName || type.commonName,
          scientificName: type.ScientificName || type.scientificName,
          wateringFrequencyDays:
            type.WateringFrequencyDays || type.wateringFrequencyDays,
          fertilizingFrequencyDays:
            type.FertilizingFrequencyDays || type.fertilizingFrequencyDays,
          sunlightNeeds: type.SunlightNeeds || type.sunlightNeeds,
          id: type.Id || type.id,
        }));
      }),
      retry(1),
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching plant types:', error);
        if (error.status === 0) {
          throw new Error(
            'Server is unreachable. Please ensure the server is running.'
          );
        } else if (error.status === 404) {
          throw new Error('No plant types found.');
        } else {
          throw new Error(error.error?.message || 'Unknown server error.');
        }
      })
    );
  }

  /** Fetch plants for current user */
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

  /** Fetch a specific plant by ID */
  getPlantById(id: number): Observable<Plant> {
    console.log('Fetching plant details for ID:', id);
    return this.http.get<Plant>(`${this.baseUrl}/plant/${id}`).pipe(
      tap((plant) => console.log('Plant details received:', plant)),
      catchError(this.handleError(`fetching plant ${id}`))
    );
  }

  /** Fetch plant type by ID */
  getPlantTypeById(id: number): Observable<PlantType> {
    console.log('Fetching plant type for ID:', id);
    return this.http.get<PlantType>(`${this.baseUrl}/planttype/${id}`).pipe(
      tap((type) => console.log('Plant type received:', type)),
      retry(1),
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching plant type:', error);
        if (error.status === 0) {
          throw new Error(
            'Server is unreachable. Please ensure the server is running.'
          );
        } else if (error.status === 404) {
          throw new Error(`Plant type with ID ${id} not found.`);
        } else {
          throw new Error(error.error?.message || 'Unknown server error.');
        }
      })
    );
  }

  /** Fetch care logs for a plant */
  getPlantCareLogs(plantId: number): Observable<any[]> {
    console.log('Fetching care logs for plant ID:', plantId);
    return this.http
      .get<any[]>(`${this.baseUrl}/carelog/plant/${plantId}`)
      .pipe(
        tap((logs) => console.log('Care logs received:', logs)),
        catchError(this.handleError(`fetching care logs for plant ${plantId}`))
      );
  }

  /** Fetch full plant info: base + type + care logs */
  getPlantWithDetails(plantId: number): Observable<{
    plant: Plant;
    plantType: PlantType;
    careLogs: any[];
  } | null> {
    if (!plantId) {
      console.error('No plant ID provided for getPlantWithDetails');
      return of(null);
    }

    console.log('Fetching full plant details for ID:', plantId);
    return this.getPlantById(plantId).pipe(
      switchMap((plant) => {
        const plantType$ = this.getPlantTypeById(plant.species);
        const careLogs$ = this.getPlantCareLogs(plantId);

        return forkJoin({
          plant: of(plant),
          plantType: plantType$,
          careLogs: careLogs$,
        }).pipe(
          tap((result) => console.log('Full plant details received:', result))
        );
      }),
      retry(1),
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching plant details:', error);
        if (error.status === 0) {
          throw new Error(
            'Server is unreachable. Please ensure the server is running.'
          );
        } else {
          throw new Error(error.error?.message || 'Unknown server error.');
        }
      })
    );
  }

  /** Save a new plant */
  savePlant(plantData: any): Observable<any> {
    console.log('Saving new plant:', plantData);
    return this.http.post(`${this.baseUrl}/plant`, plantData).pipe(
      tap((response) => console.log('Plant saved:', response)),
      catchError(this.handleError('saving plant'))
    );
  }

  /** Update existing plant */
  updatePlant(id: number, plantData: any): Observable<any> {
    console.log('Updating plant ID:', id);

    const updatedPlant = {
      ...plantData,
      id: id,
    };

    return this.http.put(`${this.baseUrl}/plant`, updatedPlant).pipe(
      tap((response) => console.log('Plant updated successfully:', response)),
      catchError(this.handleError(`updating plant ${id}`))
    );
  }

  /** Delete a plant */
  deletePlant(id: number): Observable<any> {
    console.log('Deleting plant ID:', id);
    return this.http.delete(`${this.baseUrl}/plant/${id}`).pipe(
      tap((response) => console.log('Plant deleted:', response)),
      catchError(this.handleError(`deleting plant ${id}`))
    );
  }

  /** Fetch problems for a specific plant */
  getPlantProblems(plantId: number): Observable<ProblemReport[]> {
    console.log('Fetching problems for plant ID:', plantId);
    return this.http
      .get<ProblemReport[]>(`${this.baseUrl}/problemreport/plant/${plantId}`)
      .pipe(
        tap((problems) => console.log('Problems received:', problems)),
        catchError(this.handleError(`fetching problems for plant ${plantId}`))
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
