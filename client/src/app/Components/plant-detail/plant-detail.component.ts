import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlantService } from '../../Services/plant.service'; // Assuming the service is in the services folder

@Component({
  selector: 'app-plant-detail',
  templateUrl: './plant-detail.component.html',
  styleUrls: ['./plant-detail.component.css']
})
export class PlantDetailComponent implements OnInit {
  plant: any;  // This will hold the selected plant's data

  constructor(
    private route: ActivatedRoute,
    private plantService: PlantService
  ) { }

  ngOnInit(): void {
    const plantId = this.route.snapshot.paramMap.get('id');  // Get the plant ID from the route parameter
    if (plantId) {
      this.getPlantDetails(plantId);  // Call the function to get plant details
    }
  }

  // Function to get the plant details using the plant's ID
  getPlantDetails(id: string): void {
    this.plantService.getPlantById(id).subscribe(
      data => {
        this.plant = data;  // Store the plant details in the plant object
      },
      error => {
        console.error('Error fetching plant details:', error);  // Handle errors
      }
    );
  }
}
