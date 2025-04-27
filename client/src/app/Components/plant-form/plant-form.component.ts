import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { PlantService } from '../../Services/plant.service';
import { Observable, BehaviorSubject, catchError, finalize, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { A11yModule } from '@angular/cdk/a11y';
import { PlantType } from '../../Models/plant-type';

@Component({
  selector: 'app-plant-form',
  templateUrl: './plant-form.component.html',
  styleUrls: ['./plant-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    A11yModule,
  ],
})
export class PlantFormComponent implements OnInit {
  plantForm: FormGroup;
  private plantTypesSubject = new BehaviorSubject<PlantType[]>([]);
  plantTypes$ = this.plantTypesSubject.asObservable();
  loading = false;
  error: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private plantService: PlantService,
    private snackBar: MatSnackBar
  ) {
    this.plantForm = this.formBuilder.group({
      name: ['', Validators.required],
      plantType: ['', Validators.required],
      plantedDate: [new Date(), Validators.required],
    });
  }

  ngOnInit() {
    this.loadPlantTypes();
  }

  /** Load plant types from the server */
  loadPlantTypes(): void {
    this.loading = true;
    this.error = null;
    console.log('Starting to load plant types...');

    this.plantService
      .getPlantTypes()
      .pipe(
        tap((types) => console.log('Plant types stream received:', types)),
        finalize(() => {
          console.log('Plant types loading completed. Loading:', this.loading);
          this.loading = false;
        })
      )
      .subscribe({
        next: (types) => {
          console.log('Plant types loaded:', types);
          if (!types || types.length === 0) {
            console.warn('No plant types available');
            this.error =
              'No plant types available. Please contact an administrator.';
          }
          this.plantTypesSubject.next(types);
        },
        error: (error: Error) => {
          console.error('Error loading plant types:', error);
          this.error = error.message || 'Failed to load plant types.';
          this.plantTypesSubject.next([]);
        },
      });
  }

  /** Convert date to local ISO format */
  toLocalDate(date: Date): string {
    const localISO = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];
    return `${localISO}T00:00:00`;
  }

  /** Handle form submission */
  onSubmit(): void {
    if (this.plantForm.valid) {
      console.log('Form submitted with values:', this.plantForm.value);
      const plantData = this.plantForm.value;
      const selectedPlantType = plantData.plantType as PlantType;

      const transformedData = {
        Name: plantData.name,
        Species: selectedPlantType.Id,
        DateAdded: this.toLocalDate(plantData.plantedDate),
        UserId: this.plantService.currentUserId,
      };

      console.log('Sending transformed data to server:', transformedData);

      this.plantService.savePlant(transformedData).subscribe({
        next: (response) => {
          console.log('Plant saved successfully:', response);
          this.snackBar.open('✅ Plant added successfully!', 'Close', {
            duration: 3000,
          });
          this.plantForm.reset({
            plantedDate: new Date(),
          });
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error saving plant:', error);
          let errorMessage = 'Failed to save plant. ';
          if (error.error instanceof ErrorEvent) {
            errorMessage += 'Please check your internet connection.';
          } else {
            errorMessage += error.error?.message || 'Unknown server error.';
          }
          this.error = errorMessage;
        },
      });
    } else {
      console.warn('Form is invalid:', this.plantForm.errors);
    }
  }
}
