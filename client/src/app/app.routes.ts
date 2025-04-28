import { Routes } from '@angular/router';
import { PlantListComponent } from './Components/plant-list/plant-list.component';
import { PlantDetailComponent } from './Components/plant-detail-dialog/plant-detail-dialog.component';

export const routes: Routes = [
  { path: 'plants', component: PlantListComponent },
  { path: 'plants/:id', component: PlantDetailComponent },
  { path: '', redirectTo: 'plants', pathMatch: 'full' },
];
