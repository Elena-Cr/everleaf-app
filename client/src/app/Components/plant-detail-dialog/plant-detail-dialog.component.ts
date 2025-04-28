import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Plant } from '../../Models/plant';
import { PlantService } from '../../Services/plant.service';
import { ProblemService } from '../../Services/problem.service';
import { ProblemFormComponent } from '../problem-form/problem-form.component';
import { ProblemReport } from '../../Models/problem-reports';

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
  ],
})
export class PlantDetailComponent implements OnInit {
  loading = true;
  plant!: Plant;
  plantType: any;
  careLogs: any[] = [];
  lastWatering: any;
  lastFertilizing: any;
  problems: ProblemReport[] = [];

  constructor(
    private plantService: PlantService,
    private problemService: ProblemService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const plantId = Number(this.route.snapshot.paramMap.get('id'));
    if (!plantId) {
      this.router.navigate(['/plants']);
      return;
    }

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
          ?.filter((log) => log.action?.toLowerCase() === 'water')
          ?.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
        this.lastWatering = waterLogs?.[0];

        // Find last fertilizing log
        const fertilizerLogs = this.careLogs
          ?.filter((log) => log.action?.toLowerCase() === 'fertilizer')
          ?.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
        this.lastFertilizing = fertilizerLogs?.[0];

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
}
