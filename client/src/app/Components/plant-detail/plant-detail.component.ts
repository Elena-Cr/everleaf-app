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
  templateUrl: './plant-detail.component.html',
  styleUrls: ['./plant-detail.component.css'],
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
  // Component state
  loading = true;
  plant!: Plant;
  plantType: any;

  careLogs: any[] = [];
  lastWatering: any;
  lastFertilizing: any;
  wateringLogs: any[] = [];
  fertilizerLogs: any[] = [];
  problems: ProblemReport[] = [];

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
                // Navigate away if the plant doesn't belong to the new user
                this.router.navigate(['/plants']);
              }
            },
            error: () => { this.router.navigate(['/plants']);},
          });
        }
      },
      error: (error) => {
        console.error('Error in user subscription:', error);
      },
    });

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
    this.loadPlantData(this.currentPlantId);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Data loading methods
  private loadPlantData(plantId: number): void {
    this.loading = true;
    this.fetchPlantDetails(plantId);
    this.loadProblems(plantId);
  }

  private loadProblems(plantId: number): void {
    this.problemService.getProblemsByPlant(plantId).subscribe({
      next: (problems) => {
        this.problems = problems;
      },
      error: () => {
        this.snackBar.open('❌ Failed to load problems', 'Close', {duration: 3000});
      },
    });
  }

  private fetchPlantDetails(plantId: number): void {
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

        const waterLogs = this.careLogs
          ?.filter((log) => log.type?.toLowerCase() === 'water')
          ?.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
        this.lastWatering = waterLogs?.[0];

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

  // Navigate back to plant list
  close(): void {
    this.router.navigate(['/plants']);
  }

  // Care log actions
  addWateringLog(): void {
    if (!this.plant?.id) return;

    const careLog = {
      type: 'Water',
      date: new Date().toISOString(),
      plantId: this.plant.id,
    };

    this.careLogService.createCareLog(careLog).subscribe({
      next: () => {
        this.snackBar.open('✅ Watering logged!', 'Close', {duration: 3000});
        this.fetchPlantDetails(this.plant.id!);
      },
      error: () => {
        this.snackBar.open('❌ Failed to log watering', 'Close', {duration: 3000});
      },
    });
  }

  addFertilizingLog(): void {
    if (!this.plant?.id) return;

    const careLog = {
      type: 'Fertilizer',
      date: new Date().toISOString(),
      plantId: this.plant.id,
    };

    this.careLogService.createCareLog(careLog).subscribe({
      next: () => {
        this.snackBar.open('✅ Fertilizing logged!', 'Close', {duration: 3000});
        this.fetchPlantDetails(this.plant.id!);
      },
      error: () => {
        this.snackBar.open('❌ Failed to log fertilizing', 'Close', {duration: 3000});
      },
    });
  }

  // Problem management
  openLogProblemDialog(): void {
    const dialogRef = this.dialog.open(ProblemFormComponent, {
      width: '500px',
      data: { plantId: this.plant.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.plant.id) {
        this.loadProblems(this.plant.id); 
      }
    });
  }

  editProblem(problem: ProblemReport): void {
    const dialogRef = this.dialog.open(ProblemFormComponent, {
      width: '500px',
      data: {
        mode: 'edit',
        problemData: problem,
        plantId: this.plant.id, 
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.plant.id) {
        this.loadProblems(this.plant.id);
      }
    });
  }

  deleteProblem(problem: ProblemReport): void {
    const dateString = problem.dateReported
      ? new Date(problem.dateReported).toLocaleDateString()
      : 'this problem';
    if (
      !problem.id ||
      !confirm(`Are you sure you want to delete ${dateString}?`)
    ) {
      return;
    }

    this.problemService.deleteProblem(problem.id).subscribe({
      next: () => {
        this.snackBar.open('✅ Problem deleted', 'Close', { duration: 3000 });
        if (this.plant.id) {
          this.loadProblems(this.plant.id);
        }
      },
      error: () => {
        this.snackBar.open('❌ Failed to delete problem', 'Close', {duration: 3000});
      },
    });
  }

  // Plant management
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
        this.snackBar.open('✅ Plant updated!', 'Close', { duration: 3000 });
        this.loadPlantData(this.plant.id);
      }
    });
  }

  deletePlant(): void {
    if (
      !this.plant?.id ||
      !confirm('Are you sure you want to delete this plant?')
    ) {
      return;
    }

    this.plantService.deletePlant(this.plant.id).subscribe({
      next: () => {
        this.snackBar.open('✅ Plant deleted successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/plants']);
      },
      error: () => {
        this.snackBar.open('❌ Failed to delete plant', 'Close', {duration: 3000});
      },
    });
  }
}
