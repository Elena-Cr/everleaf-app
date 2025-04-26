import { Routes } from '@angular/router';
import { PlantListComponent } from './Components/plant-list/plant-list.component';
import { PlantDetailComponent } from './Components/plant-detail/plant-detail.component';

export const routes: Routes = [
  { path: 'plants', component: PlantListComponent },
  { path: 'plant/:id', component: PlantDetailComponent },
  { path: '', redirectTo: 'plants', pathMatch: 'full' },
];
