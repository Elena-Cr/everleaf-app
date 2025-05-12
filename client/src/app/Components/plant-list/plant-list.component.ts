import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlantService } from '../../Services/plant.service';
import { AuthService } from '../../Services/auth.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { Plant } from '../../Models/plant';
import { PlantFormComponent } from '../plant-form/plant-form.component';
import { CareLogFormComponent } from '../care-log-form/care-log-form.component';
import { animate, state, style, transition, trigger} from '@angular/animations';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PlantDashboardComponent } from '../plant-dashboard/plant-dashboard.component';

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
    RouterModule,
    PlantDashboardComponent,
  ],
  animations: [
    trigger('fadeIn', 
      [
      state('void', style({ opacity: 0 })),
      transition(':enter', [animate('300ms ease-in')]),
    ]),
  ],
})
export class PlantListComponent implements OnInit, OnDestroy {
  // Component state
  plants: Plant[] = [];
  loading: boolean = true;
  error: string | null = null;
  currentUserName: string = '';

  currentPage = 0;
  pageSize = 3;

  private destroy$ = new Subject<void>();

  constructor(
    private auth: AuthService,
    private plantService: PlantService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Listen to user changes and (re)load plants
    this.plantService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (user: { id: number; name: string }) => {
        this.currentUserName = user.name;
        this.loadPlants(user.id);
      },
      error: (error) => {
        console.error('Error in user subscription:', error);
        this.error = 'Failed to load user data';
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openAddPlantDialog(): void {
    const dialogRef = this.dialog.open(PlantFormComponent, {
      width: '500px',
      data: { mode: 'add' },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result) {
          this.loadPlants(this.plantService.currentUserId);
        }
      });
  }

  openCareLogDialog(plant: Plant): void {
    const dialogRef = this.dialog.open(CareLogFormComponent, {
      width: '500px',
      data: { plantId: plant.id },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result) {
          this.loadPlants(this.plantService.currentUserId);
        }
      });
  }

  viewDetails(plant: Plant): void {
    if (!plant || !plant.id) {
      console.error('Invalid plant for navigation');
      return;
    }
    this.router.navigate(['/plants', plant.id]);
  }

  loadPlants(userId: number): void {
    this.loading = true;
    this.error = null;

    this.plantService.getPlantsWithWateringData(userId).subscribe({
      next: (plants) => {
        this.plants = plants
          .map((plant) => {
            // Format the status for display
            const status = plant.needsWatering
              ? 'Needs watering!'
              : `Due in ${plant.wateringFrequencyDays - plant.daysSinceWatering} 
              day${plant.wateringFrequencyDays - plant.daysSinceWatering > 1 ? 's'  : ''}`;
            return {
              ...plant,
              status,
            };
          })
          .sort((a, b) => {
            // Sort plants: "Needs watering!" first, then "Due in X days"
            if (
              a.status === 'Needs watering!' &&
              b.status !== 'Needs watering!'
            ) {
              return -1;
            }
            if (
              a.status !== 'Needs watering!' &&
              b.status === 'Needs watering!'
            ) {
              return 1;
            }
            return 0; // Keep the same order for plants with the same status
          });

        this.loading = false;
        this.currentPage = 0;
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
