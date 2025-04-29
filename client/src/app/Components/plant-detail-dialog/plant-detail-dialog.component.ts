import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Plant } from '../../Models/plant';
import { PlantService } from '../../Services/plant.service';
import { ProblemService } from '../../Services/problem.service';
import { ProblemFormComponent } from '../problem-form/problem-form.component';
import { ProblemReport } from '../../Models/problem-reports';
import { PlantFormComponent } from '../plant-form/plant-form.component';
import { CareLogService } from '../../Services/carelog.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-plant-detail',
  templateUrl: './plant-detail-dialog.component.html',
  styleUrls: ['./plant-detail-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    RouterModule,
  ],
})
export class PlantDetailComponent implements OnInit, OnDestroy {
  loading = true;
  plant!: Plant;
  plantType: any;
  careLogs: any[] = [];
  lastWatering: any;
  lastFertilizing: any;
  problems: ProblemReport[] = [];
  wateringLogs: any[] = [];
  fertilizerLogs: any[] = [];
  private destroy$ = new Subject<void>();
  private currentPlantId: number | null = null;

  constructor(
    private plantService: PlantService,
    private problemService: ProblemService,
    private careLogService: CareLogService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get initial plant ID
    this.currentPlantId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.currentPlantId) {
      this.router.navigate(['/plants']);
      return;
    }

    // Subscribe to user changes
    this.plantService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (user) => {
        if (this.currentPlantId) {
          // Check if the plant belongs to the new user
          this.plantService.getPlantById(this.currentPlantId).subscribe({
            next: (plant) => {
              if (plant.userId !== user.id) {
                // Only navigate away if the plant doesn't belong to the new user
                this.router.navigate(['/plants']);
              }
            },
            error: () => {
              // If there's an error fetching the plant, navigate back
              this.router.navigate(['/plants']);
            },
          });
        }
      },
      error: (error) => {
        console.error('Error in user subscription:', error);
      },
    });

    // Subscribe to route parameter changes
    this.route.params
      .pipe(
        takeUntil(this.destroy$),
        filter((params) => params['id'])
      )
      .subscribe((params) => {
        const plantId = Number(params['id']);
        this.currentPlantId = plantId;
        this.loadPlantData(plantId);
      });

    // Initial load
    this.loadPlantData(this.currentPlantId);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPlantData(plantId: number): void {
    this.loading = true;
    this.fetchPlantDetails(plantId);
    this.loadProblems(plantId);
  }

  /** Load problems for the plant */
  loadProblems(plantId: number): void {
    this.problemService.getProblemsByPlant(plantId).subscribe({
      next: (problems) => {
        this.problems = problems;
      },
      error: (error) => {
        console.error('Error loading problems:', error);
      },
    });
  }

  /** Load plant details from server */
  fetchPlantDetails(plantId: number): void {
    this.loading = true;

    this.plantService.getPlantWithDetails(plantId).subscribe({
      next: (data) => {
        if (!data) {
          console.error('No plant details received');
          this.loading = false;
          return;
        }

        this.plant = data.plant;
        this.plantType = data.plantType;
        this.careLogs = data.careLogs;

        // Find last watering log
        const waterLogs = this.careLogs
          ?.filter((log) => log.type?.toLowerCase() === 'water')
          ?.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
        this.lastWatering = waterLogs?.[0];

        // Find last fertilizing log
        const fertilizerLogs = this.careLogs
          ?.filter((log) => log.type?.toLowerCase() === 'fertilizer')
          ?.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
        this.lastFertilizing = fertilizerLogs?.[0];

        // Separate logs by type for display
        this.wateringLogs = waterLogs || [];
        this.fertilizerLogs = fertilizerLogs || [];

        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading plant details:', error);
        this.loading = false;
      },
    });
  }

  /** Navigate back to plant list */
  close(): void {
    this.router.navigate(['/plants']);
  }

  /** Open the Log Problem Form */
  openLogProblemDialog(): void {
    const dialogRef = this.dialog.open(ProblemFormComponent, {
      width: '500px',
      data: this.plant.id,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.plant.id) {
        console.log('Problem logged:', result);
        this.loadProblems(this.plant.id);
      }
    });
  }

  /** Edit Plant */
  editPlant(): void {
    const dialogRef = this.dialog.open(PlantFormComponent, {
      width: '500px',
      data: {
        mode: 'edit',
        plant: this.plant,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.plant?.id) {
        console.log('Plant updated:', result);
        this.loadPlantData(this.plant.id);
      }
    });
  }

  /** Delete Plant */
  deletePlant(): void {
    if (
      !this.plant?.id ||
      !confirm('Are you sure you want to delete this plant?')
    ) {
      return;
    }

    this.plantService.deletePlant(this.plant.id).subscribe({
      next: () => {
        console.log('Plant deleted successfully.');
        this.router.navigate(['/plants']);
      },
      error: (error) => {
        console.error('Error deleting plant:', error);
        this.snackBar.open('❌ Failed to delete plant', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  /** Quick action to add a watering log */
  addWateringLog(): void {
    if (!this.plant?.id) return;

    const careLog = {
      type: 'Water',
      date: new Date().toISOString(),
      plantId: this.plant.id,
    };

    this.careLogService.createCareLog(careLog).subscribe({
      next: () => {
        this.snackBar.open('✅ Watering logged!', 'Close', { duration: 3000 });
        this.fetchPlantDetails(this.plant.id!);
      },
      error: (error) => {
        console.error('Error logging watering:', error);
        this.snackBar.open('❌ Failed to log watering', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  /** Quick action to add a fertilizing log */
  addFertilizingLog(): void {
    if (!this.plant?.id) return;

    const careLog = {
      type: 'Fertilizer',
      date: new Date().toISOString(),
      plantId: this.plant.id,
    };

    this.careLogService.createCareLog(careLog).subscribe({
      next: () => {
        this.snackBar.open('✅ Fertilizing logged!', 'Close', {
          duration: 3000,
        });
        this.fetchPlantDetails(this.plant.id!);
      },
      error: (error) => {
        console.error('Error logging fertilizing:', error);
        this.snackBar.open('❌ Failed to log fertilizing', 'Close', {
          duration: 3000,
        });
      },
    });
  }
}
