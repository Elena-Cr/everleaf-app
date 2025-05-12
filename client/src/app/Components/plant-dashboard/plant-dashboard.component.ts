import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { PlantService } from '../../Services/plant.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-plant-dashboard',
  templateUrl: './plant-dashboard.component.html',
  styleUrls: ['./plant-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatGridListModule],
})
export class PlantDashboardComponent implements OnInit, OnDestroy {
  totalPlants = 0;
  plantsNeedingWater = 0;
  plantsNeedingFertilizer = 0;
  mostCommonIssue: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(private plantService: PlantService) {}

  ngOnInit() {
    // Subscribe to user changes to update dashboard
    this.plantService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (user) => {
        this.loadDashboardData(user.id);
      },
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDashboardData(userId: number) {
    this.plantService
      .getPlantStatistics(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => {
          this.totalPlants = stats.totalPlants;
          this.plantsNeedingWater = stats.plantsNeedingWater;
          this.plantsNeedingFertilizer = stats.plantsNeedingFertilizer;
          this.mostCommonIssue = stats.mostCommonIssue;
        },
      });
  }
}
