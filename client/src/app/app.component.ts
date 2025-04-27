import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { PlantService } from './Services/plant.service';
import { PlantFormComponent } from './Components/plant-form/plant-form.component';
import { AsyncPipe, NgIf } from '@angular/common';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    AsyncPipe,
    NgIf,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  currentUserName = '';

  constructor(private plantService: PlantService, private dialog: MatDialog) {
    this.plantService.currentUser$
      .pipe(map((user) => user.name))
      .subscribe((name) => (this.currentUserName = name));
  }

  selectUser(userId: number) {
    console.log('User selected:', userId);
    this.plantService.setCurrentUserId(userId);
  }

  openAddPlantDialog() {
    this.dialog.open(PlantFormComponent, {
      width: '500px',
      panelClass: 'plant-detail-dialog',
    });
  }
}
