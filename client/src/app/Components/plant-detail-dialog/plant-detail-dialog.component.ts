import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Plant } from '../../Models/plant';
import { PlantService } from '../../Services/plant.service';

@Component({
  selector: 'app-plant-detail-dialog',
  templateUrl: './plant-detail-dialog.component.html',
  styleUrls: ['./plant-detail-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
})
export class PlantDetailDialogComponent implements OnInit {
  loading = true;
  plantDetails: any;
  plantType: any;
  careLogs: any[] = [];
  lastWatering: any;
  lastFertilizing: any;

  constructor(
    public dialogRef: MatDialogRef<PlantDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public plant: Plant,
    private plantService: PlantService
  ) {}

  ngOnInit() {
    this.loadPlantDetails();
  }

  loadPlantDetails() {
    if (!this.plant?.id) {
      console.error('No plant ID provided');
      this.loading = false;
      return;
    }

    this.plantService.getPlantWithDetails(this.plant.id).subscribe({
      next: (data) => {
        if (!data) {
          console.error('No plant details received');
          this.loading = false;
          return;
        }

        console.log('Plant details received:', data);
        this.plantDetails = data.plant;
        this.plantType = data.plantType;
        this.careLogs = data.careLogs;

        // Filter and sort water logs
        const waterLogs = this.careLogs
          ?.filter((log) => log.type?.toLowerCase() === 'water')
          ?.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
        this.lastWatering = waterLogs?.[0];

        // Filter and sort fertilizer logs
        const fertilizerLogs = this.careLogs
          ?.filter((log) => log.type?.toLowerCase() === 'fertilizer')
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

  close(): void {
    this.dialogRef.close();
  }
}
