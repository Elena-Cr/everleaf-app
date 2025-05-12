// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { PlantListComponent } from './Components/plant-list/plant-list.component';
import { PlantDetailComponent } from './Components/plant-detail-dialog/plant-detail-dialog.component';
import { authGuard, authPageGuard } from './Services/auth.guard';

export const routes: Routes = [
  // Auth pages - redirect to plants if already logged in
  { path: 'login', component: LoginComponent, canActivate: [authPageGuard] },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [authPageGuard],
  },

  // Protected routes - require authentication
  { path: 'plants', component: PlantListComponent, canActivate: [authGuard] },
  {
    path: 'plants/:id',
    component: PlantDetailComponent,
    canActivate: [authGuard],
  },

  // Default route
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
