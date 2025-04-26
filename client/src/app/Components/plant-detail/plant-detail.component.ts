import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlantService } from '../../Services/plant.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plant-detail',
  templateUrl: './plant-detail.component.html',
  styleUrls: ['./plant-detail.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class PlantDetailComponent implements OnInit {
  plant: any; // This will hold the selected plant's data

  constructor(
    private route: ActivatedRoute,
    private plantService: PlantService
  ) {}

  ngOnInit(): void {
    const plantId = this.route.snapshot.paramMap.get('id'); // Get the plant ID from the route parameter
    if (plantId) {
      this.getPlantDetails(Number(plantId)); // Convert string to number
    }
  }

  getPlantDetails(id: number): void {
    this.plantService.getPlantById(id).subscribe({
      next: (data) => {
        this.plant = data;
      },
      error: (error) => {
        console.error('Error fetching plant details:', error);
      },
    });
  }
}
