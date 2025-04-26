import { Component, OnInit } from '@angular/core';
import { PlantService } from '../../Services/plant.service';

@Component({
  selector: 'app-plant-list',
  templateUrl: './plant-list.component.html',
  styleUrls: ['./plant-list.component.css']
})
export class PlantListComponent implements OnInit {
  plants: any[] = [];  // list of plants

  constructor(private plantService: PlantService) { }

  ngOnInit(): void {
    this.loadPlants();
  }

  // Method to load plants from the service
  loadPlants(): void {
    this.plantService.getPlants().subscribe((data: any[]) => {
      this.plants = data;  // Store the data into the 'plants' array
    });
  }
}