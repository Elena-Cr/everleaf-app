import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CareLogFormComponent } from './Components/care-log-form/care-log-form.component';
import { ProblemFormComponent } from './Components/problem-form/problem-form.component';
import { PlantFormComponent } from './Components/plant-form/plant-form.component';
import { PlantListComponent } from './Components/plant-list/plant-list.component';
import { PlantDetailComponent } from './Components/plant-detail/plant-detail.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CareLogFormComponent,
    ProblemFormComponent,
    PlantFormComponent,
    PlantListComponent,
    PlantDetailComponent,
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {}
