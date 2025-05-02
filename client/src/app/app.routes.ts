// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { PlantListComponent } from './Components/plant-list/plant-list.component';
import { PlantDetailComponent } from './Components/plant-detail-dialog/plant-detail-dialog.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'plants', component: PlantListComponent },
  { path: 'plants/:id', component: PlantDetailComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
