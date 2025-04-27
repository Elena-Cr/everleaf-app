import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { PlantService } from './Services/plant.service'; // <-- import

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private plantService: PlantService) {}

  selectUser(userId: number) {
    console.log('User selected:', userId);
    this.plantService.setCurrentUserId(userId);
  }
}
