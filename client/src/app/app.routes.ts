import { Routes } from '@angular/router';
import { PlantListComponent } from './Components/plant-list/plant-list.component';

export const routes: Routes = [
  { path: 'plants', component: PlantListComponent },
  { path: '', redirectTo: 'plants', pathMatch: 'full' },
];
