import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { PlantService } from '../../Services/plant.service';
import { Observable, catchError, finalize, of, tap } from 'rxjs';
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
  ],
})
export class PlantFormComponent implements OnInit {
  plantForm: FormGroup;
  plantTypes$: Observable<any[]>;
  loading = false;
  error: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private plantService: PlantService
  ) {
    this.plantForm = this.formBuilder.group({
      name: ['', Validators.required],
      plantType: ['', Validators.required],
      plantedDate: [new Date(), Validators.required],
    });

    this.plantTypes$ = of([]);
  }

  ngOnInit() {
    this.plantForm = this.formBuilder.group({
      name: ['', Validators.required],
      plantType: ['', Validators.required],
      plantedDate: [new Date(), Validators.required],
    });

    this.loadPlantTypes();
  }

  loadPlantTypes(): void {
    this.loading = true;
    this.error = null;
    console.log('Loading plant types...');

    this.plantTypes$ = this.plantService.getPlantTypes().pipe(
      tap((types) => {
        console.log('Plant types loaded:', types);
        if (!types || types.length === 0) {
          console.warn('No plant types returned from the server');
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error loading plant types:', error);
        let errorMessage = 'Failed to load plant types. ';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage += 'Please check your internet connection.';
        } else {
          // Server-side error
          errorMessage += `Server returned code ${error.status}. `;
          if (error.status === 404) {
            errorMessage += 'Plant types not found.';
          } else if (error.status === 0) {
            errorMessage += 'Server is unreachable.';
          } else {
            errorMessage += error.error?.message || 'Unknown error occurred.';
          }
        }

        this.error = errorMessage;
        return of([]);
      }),
      finalize(() => {
        this.loading = false;
        console.log('Plant types loading complete');
      })
    );
  }

  toLocalDate(date: Date): string {
    const localISO = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];
    return `${localISO}T00:00:00`;
  }

  onSubmit(): void {
    if (this.plantForm.valid) {
      console.log('Form submitted with values:', this.plantForm.value);
      const plantData = this.plantForm.value;

      const transformedData = {
        Name: plantData.plantType.commonName,
        Nickname: plantData.name,
        DateAdded: this.toLocalDate(plantData.plantedDate),
        UserId: 1, // Replace with actual user ID
        Species: Number(plantData.plantType.id),
      };

      console.log('Sending transformed data to server:', transformedData);

      this.plantService.savePlant(transformedData).subscribe({
        next: (response) => {
          console.log('Plant saved successfully:', response);
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
            errorMessage += `Server returned code ${error.status}. `;
            errorMessage += error.error?.message || 'Unknown error occurred.';
          }

          this.error = errorMessage;
        },
      });
    } else {
      console.warn('Form is invalid:', this.plantForm.errors);
    }
  }
}
