import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlantListComponent } from './Components/plant-list/plant-list.component';
import { PlantDetailComponent } from './Components/plant-detail/plant-detail.component';


const routes: Routes = [
  { path: '', component: PlantListComponent },
  { path: 'plant/:id', component: PlantDetailComponent }  // Route to plant details
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
