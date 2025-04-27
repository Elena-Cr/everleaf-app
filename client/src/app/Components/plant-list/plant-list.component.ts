import { Component, OnInit } from '@angular/core';
import { PlantService } from '../../Services/plant.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Plant } from '../../Models/plant';
import { PlantDetailDialogComponent } from '../plant-detail-dialog/plant-detail-dialog.component';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-plant-list',
  templateUrl: './plant-list.component.html',
  styleUrls: ['./plant-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class PlantListComponent implements OnInit {
  plants: Plant[] = [];
  loading: boolean = true;
  error: string | null = null;
  currentPage = 0;
  pageSize = 3;

  constructor(
    private plantService: PlantService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPlants();
  }

  loadPlants(): void {
    this.loading = true;
    this.error = null;

    this.plantService.getPlants().subscribe({
      next: (data) => {
        this.plants = data;
        this.loading = false;
        this.currentPage = 0; // Reset page to first when new plants load
      },
      error: (error) => {
        console.error('Error fetching plants:', error);
        this.error = 'Failed to load plants. Please try again later.';
        this.loading = false;
        this.snackBar.open('❌ Failed to load plants', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  viewDetails(plant: Plant): void {
    this.dialog.open(PlantDetailDialogComponent, {
      data: plant,
      width: '500px',
      panelClass: 'plant-detail-dialog',
    });
  }

  get currentPagePlants(): Plant[] {
    if (!this.plants.length) return [];
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    return this.plants.slice(start, end);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.plants.length / this.pageSize));
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }
}
