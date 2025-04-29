import { Component, OnInit } from '@angular/core';
import { PlantService } from '../../Services/plant.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Plant } from '../../Models/plant';
import { PlantFormComponent } from '../plant-form/plant-form.component';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

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
      state('void', style({ opacity: 0 })),
      transition(':enter', [animate('300ms ease-in')]),
    ]),
  ],
})
export class PlantListComponent implements OnInit {
  plants: Plant[] = [];
  loading: boolean = true;
  error: string | null = null;
  currentPage = 0;
  pageSize = 3;
  currentUserName: string = '';

  constructor(
    private plantService: PlantService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Listen to user changes and reload plants
    this.plantService.currentUser$.subscribe(
      (user: { id: number; name: string }) => {
        console.log('User changed, loading plants for user:', user.id);
        this.currentUserName = user.name;
        this.loadPlants(user.id);
      }
    );
  }

  openAddPlantDialog(): void {
    const dialogRef = this.dialog.open(PlantFormComponent, {
      width: '500px',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPlants(this.plantService.currentUserId);
      }
    });
  }

  loadPlants(userId: number): void {
    this.loading = true;
    this.error = null;

    this.plantService.getPlants(userId).subscribe({
      next: (data) => {
        this.plants = data;
        this.loading = false;
        this.currentPage = 0; // reset to page 0 when user changes
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
    this.router.navigate(['/plants', plant.id]);
  }

  get currentPagePlants(): Plant[] {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    return this.plants.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.plants.length / this.pageSize);
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
