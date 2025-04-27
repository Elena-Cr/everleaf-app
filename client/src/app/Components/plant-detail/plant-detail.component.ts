import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlantService } from '../../Services/plant.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-plant-detail',
  templateUrl: './plant-detail.component.html',
  styleUrls: ['./plant-detail.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule, MatButtonModule, MatSnackBarModule],
})
export class PlantDetailComponent implements OnInit {
  plant: any;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private plantService: PlantService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const plantId = this.route.snapshot.paramMap.get('id');
    if (plantId) {
      this.getPlantDetails(Number(plantId));
    }
  }

  getPlantDetails(id: number): void {
    this.loading = true;
    this.error = null;
    
    this.plantService.getPlantById(id).subscribe({
      next: (data) => {
        this.plant = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching plant details:', error);
        this.error = 'Failed to load plant details. Please try again later.';
        this.loading = false;
        this.snackBar.open('❌ Failed to load plant details', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
