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
  private baseUrl: string = 'http://localhost:5234/api';

  // BehaviorSubject to track the currently logged in user
  private currentUserSubject = new BehaviorSubject<{
    id: number;
    name: string;
  }>({ id: 0, name: '' });
  currentUser$ = this.currentUserSubject.asObservable().pipe(delay(100));

  constructor(private http: HttpClient, private auth: AuthService) {
    // Subscribe to AuthService to update currentUserSubject
    this.auth.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUserSubject.next({ id: user.id, name: user.username });
      } else {
        this.currentUserSubject.next({ id: 0, name: '' });
      }
    });
  }

  get currentUserId(): number {
    return this.currentUserSubject.value.id;
  }

  getPlantTypes(): Observable<PlantType[]> {
    return this.http.get<PlantType[]>(`${this.baseUrl}/planttype`).pipe(
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

  getPlants(userId: number = this.currentUserId): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/plant`, {
        params: { userId: userId.toString() },
      })
      .pipe(
        catchError(this.handleError('fetching plants'))
      );
  }

  getPlantById(id: number): Observable<Plant> {
    console.log('Fetching plant details for ID:', id);
    return this.http.get<Plant>(`${this.baseUrl}/plant/${id}`).pipe(
      catchError(this.handleError(`fetching plant ${id}`))
    );
  }

  getPlantTypeById(id: number): Observable<PlantType> {
    return this.http.get<PlantType>(`${this.baseUrl}/planttype/${id}`).pipe(
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

  savePlant(plantData: any): Observable<any> {
    console.log('Saving new plant:', plantData);
    return this.http.post(`${this.baseUrl}/plant`, plantData).pipe(
      catchError(this.handleError('saving plant'))
    );
  }

  updatePlant(id: number, plantData: any): Observable<any> {
    const updatedPlant = {
      ...plantData,
      id: id,
    };

    return this.http.put(`${this.baseUrl}/plant`, updatedPlant).pipe(
      catchError(this.handleError(`updating plant ${id}`))
    );
  }

  deletePlant(id: number): Observable<any> {
    console.log('Deleting plant ID:', id);
    return this.http.delete(`${this.baseUrl}/plant/${id}`).pipe(
      catchError(this.handleError(`deleting plant ${id}`))
    );
  }


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

  getPlantCareLogs(plantId: number): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/carelog/plant/${plantId}`)
      .pipe(
        catchError(this.handleError(`fetching care logs for plant ${plantId}`))
      );
  }

  getPlantWithDetails(plantId: number): Observable<{
    plant: Plant;
    plantType: PlantType;
    careLogs: any[];
  } | null> {
    if (!plantId) {
      console.error('No plant ID provided for getPlantWithDetails');
      return of(null);
    }

    return this.getPlantById(plantId).pipe(
      switchMap((plant) => {
        const plantType$ = this.getPlantTypeById(plant.species);
        const careLogs$ = this.getPlantCareLogs(plantId);

        return forkJoin({
          plant: of(plant),
          plantType: plantType$,
          careLogs: careLogs$,
        });
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

          const daysSinceWatering = lastWatering
            ? Math.floor(
                (now.getTime() - lastWatering.getTime()) / (1000 * 60 * 60 * 24)
              )
            : null;

          const wateringFrequencyDays = plantType?.wateringFrequencyDays || 7; // Default to 7 days
          const needsWatering =
            lastWatering && daysSinceWatering !== null
              ? daysSinceWatering >= wateringFrequencyDays
              : false;

          return {
            ...plant,
            plantType,
            lastWatering,
            wateringFrequencyDays,
            daysSinceWatering,
            needsWatering,
          };
        });
      })
    );
  }

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
