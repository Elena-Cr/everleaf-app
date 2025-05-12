// src/app/services/plant.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, forkJoin } from 'rxjs';
import { catchError, tap, retry, switchMap, delay, map } from 'rxjs/operators';
import { Plant } from '../Models/plant';
import { PlantType } from '../Models/plant-type';
import { AuthService } from './auth.service';

interface PlantStatistics {
  totalPlants: number;
  plantsNeedingWater: number;
  plantsNeedingFertilizer: number;
  mostCommonIssue: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class PlantService {
  // Service configuration
  private baseUrl: string = 'http://localhost:5234/api';

  // Dummy user list (no longer used for manual user switching)
  private users: { id: number; name: string }[] = [];

  // BehaviorSubject to track the currently logged in user
  private currentUserSubject = new BehaviorSubject<{
    id: number;
    name: string;
  }>({ id: 0, name: '' });
  currentUser$ = this.currentUserSubject.asObservable().pipe(delay(100));

  // Service initialization
  constructor(private http: HttpClient, private auth: AuthService) {
    // Subscribe to AuthService to update currentUserSubject
    this.auth.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUserSubject.next({ id: user.id, name: user.username });
        console.log('PlantService detected login, switched to user:', user);
      } else {
        this.currentUserSubject.next({ id: 0, name: '' });
        console.log('PlantService detected logout, cleared user');
      }
    });
  }

  // Current user management
  // Get current user ID
  get currentUserId(): number {
    return this.currentUserSubject.value.id;
  }

  // CRUD Operations
  // Fetch plant types
  getPlantTypes(): Observable<PlantType[]> {
    console.log('Fetching plant types from:', `${this.baseUrl}/planttype`);
    return this.http.get<PlantType[]>(`${this.baseUrl}/planttype`).pipe(
      tap((types) => {
        console.log('Raw plant types received:', types);
        if (!types || types.length === 0) {
          console.warn('No plant types returned from server');
        } else {
          console.log('First plant type:', types[0]);
        }
      }),
      map((types: any[]) =>
        types.map((type: any) => ({
          ...type,
          commonName: type.CommonName || type.commonName,
          scientificName: type.ScientificName || type.scientificName,
          wateringFrequencyDays:
            type.WateringFrequencyDays || type.wateringFrequencyDays,
          fertilizingFrequencyDays:
            type.FertilizingFrequencyDays || type.fertilizingFrequencyDays,
          sunlightNeeds: type.SunlightNeeds || type.sunlightNeeds,
          id: type.Id || type.id,
        }))
      )
    );
  }

  // Fetch plants for current user
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

  // Fetch a specific plant by ID
  getPlantById(id: number): Observable<Plant> {
    console.log('Fetching plant details for ID:', id);
    return this.http.get<Plant>(`${this.baseUrl}/plant/${id}`).pipe(
      tap((plant) => console.log('Plant details received:', plant)),
      catchError(this.handleError(`fetching plant ${id}`))
    );
  }

  // Fetch plant type by ID
  getPlantTypeById(id: number): Observable<PlantType> {
    console.log('Fetching plant type for ID:', id);
    return this.http.get<PlantType>(`${this.baseUrl}/planttype/${id}`).pipe(
      tap((type) => console.log('Plant type received:', type)),
      retry(1),
      catchError((error: HttpErrorResponse) => {
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

  // Save a new plant
  savePlant(plantData: any): Observable<any> {
    console.log('Saving new plant:', plantData);
    return this.http.post(`${this.baseUrl}/plant`, plantData).pipe(
      tap((response) => console.log('Plant saved:', response)),
      catchError(this.handleError('saving plant'))
    );
  }

  // Update existing plant
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

  // Delete a plant
  deletePlant(id: number): Observable<any> {
    console.log('Deleting plant ID:', id);
    return this.http.delete(`${this.baseUrl}/plant/${id}`).pipe(
      tap((response) => console.log('Plant deleted:', response)),
      catchError(this.handleError(`deleting plant ${id}`))
    );
  }

  // Plant Statistics and Analytics
  // Get statistics for plants
  getPlantStatistics(userId: number): Observable<PlantStatistics> {
    return forkJoin({
      plants: this.getPlants(userId),
      plantTypes: this.getPlantTypes(),
      careLogs: this.getAllCareLogs(userId),
      problems: this.getAllProblems(userId),
    }).pipe(
      map(({ plants, plantTypes, careLogs, problems }) => {
        const now = new Date();
        const plantsWithTypes = plants.map((plant) => ({
          ...plant,
          plantType: plantTypes.find((pt) => pt.id === plant.species),
        }));

        const plantsNeedingWater = plantsWithTypes.filter((plant) => {
          const lastWatering = careLogs
            .filter(
              (log) =>
                log.plantId === plant.id && log.type?.toLowerCase() === 'water'
            )
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )[0];

          if (!lastWatering || !plant.plantType?.wateringFrequencyDays)
            return false;

          const daysSinceWatering = Math.floor(
            (now.getTime() - new Date(lastWatering.date).getTime()) /
              (1000 * 60 * 60 * 24)
          );

          return daysSinceWatering >= plant.plantType.wateringFrequencyDays;
        });

        const plantsNeedingFertilizer = plantsWithTypes.filter((plant) => {
          const lastFertilizing = careLogs
            .filter(
              (log) =>
                log.plantId === plant.id &&
                log.type?.toLowerCase() === 'fertilizer'
            )
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )[0];

          if (!lastFertilizing || !plant.plantType?.fertilizingFrequencyDays)
            return false;

          const daysSinceFertilizing = Math.floor(
            (now.getTime() - new Date(lastFertilizing.date).getTime()) /
              (1000 * 60 * 60 * 24)
          );

          return (
            daysSinceFertilizing >= plant.plantType.fertilizingFrequencyDays
          );
        });

        const issueCount = problems.reduce((acc, problem) => {
          acc[problem.issue] = (acc[problem.issue] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const sortedIssues = Object.entries(issueCount).sort(
          ([, countA], [, countB]) => (countB as number) - (countA as number)
        );

        const mostCommonIssue =
          sortedIssues.length > 0 ? sortedIssues[0][0] : null;

        return {
          totalPlants: plants.length,
          plantsNeedingWater: plantsNeedingWater.length,
          plantsNeedingFertilizer: plantsNeedingFertilizer.length,
          mostCommonIssue,
        };
      })
    );
  }

  // Care Log Management
  // Fetch care logs for a plant
  getPlantCareLogs(plantId: number): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/carelog/plant/${plantId}`)
      .pipe(
        catchError(this.handleError(`fetching care logs for plant ${plantId}`))
      );
  }

  // Fetch full plant info: base + type + care logs
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

  // Get plants with watering data
  getPlantsWithWateringData(userId: number): Observable<any[]> {
    return forkJoin({
      plants: this.getPlants(userId),
      plantTypes: this.getPlantTypes(),
      careLogs: this.getAllCareLogs(userId),
    }).pipe(
      map(({ plants, plantTypes, careLogs }) => {
        const now = new Date();

        return plants.map((plant) => {
          const plantType = plantTypes.find((pt) => pt.id === plant.species);

          // Find the last watering log for this plant
          const lastWateringLog = careLogs
            .filter(
              (log) =>
                log.plantId === plant.id && log.type?.toLowerCase() === 'water'
            )
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )[0];

          const lastWatering = lastWateringLog
            ? new Date(lastWateringLog.date)
            : null;

          // Calculate days since last watering
          const daysSinceWatering = lastWatering
            ? Math.floor(
                (now.getTime() - lastWatering.getTime()) / (1000 * 60 * 60 * 24)
              )
            : null;

          // Determine if the plant needs watering
          const wateringFrequencyDays = plantType?.wateringFrequencyDays || 7; // Default to 7 days
          const needsWatering =
            lastWatering && daysSinceWatering !== null
              ? daysSinceWatering >= wateringFrequencyDays
              : false;

          // Find the last fertilizing log for this plant
          const lastFertilizingLog = careLogs
            .filter(
              (log) =>
                log.plantId === plant.id &&
                log.type?.toLowerCase() === 'fertilizer'
            )
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )[0];

          const lastFertilizing = lastFertilizingLog
            ? new Date(lastFertilizingLog.date)
            : null;

          // Calculate days since last fertilizing
          const daysSinceFertilizing = lastFertilizing
            ? Math.floor(
                (now.getTime() - lastFertilizing.getTime()) /
                (1000 * 60 * 60 * 24)
              )
            : null;

          // Determine if the plant needs fertilizing
          const fertilizingFrequencyDays =
            plantType?.fertilizingFrequencyDays || 30; // Default to 30 days
          const needsFertilizing =
            lastFertilizing && daysSinceFertilizing !== null
              ? daysSinceFertilizing >= fertilizingFrequencyDays
              : false;

          // Return enriched plant data
          return {
            ...plant,
            plantType,
            lastWatering,
            wateringFrequencyDays,
            daysSinceWatering,
            needsWatering,
            lastFertilizing,
            fertilizingFrequencyDays,
            daysSinceFertilizing,
            needsFertilizing,
          };
        });
      })
    );
  }

  // Helper Methods
  private getAllCareLogs(userId: number): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/carelog/user/${userId}`)
      .pipe(catchError(() => of([])));
  }

  private getAllProblems(userId: number): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/problemreport/user/${userId}`)
      .pipe(catchError(() => of([])));
  }

  // Error handling
  private handleError(operation: string) {
    return (error: HttpErrorResponse) => {
      if (error.status === 0) {
        throw new Error(
          'Server is unreachable. Please ensure the server is running.'
        );
      } else if (error.status === 404) {
        throw new Error(`Resource not found.`);
      } else {
        throw new Error(error.error?.message || 'Unknown server error.');
      }
    };
  }
}
