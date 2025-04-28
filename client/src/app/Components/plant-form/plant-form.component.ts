import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
import { MatDialogRef } from '@angular/material/dialog';
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

  @Output() plantAdded = new EventEmitter<void>();

  constructor(
    private formBuilder: FormBuilder,
    private plantService: PlantService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<PlantFormComponent>
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

  loadPlantTypes(): void {
    this.loading = true;
    this.error = null;
    console.log('Starting to load plant types...');

    this.plantService
      .getPlantTypes()
      .pipe(
        tap((types) => console.log('Plant types loaded:', types)),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (types) => {
          if (!types || types.length === 0) {
            this.error = 'No plant types available. Please contact admin.';
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

  toLocalDate(date: Date): string {
    const localISO = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];
    return `${localISO}T00:00:00`;
  }

  onSubmit(): void {
    if (this.plantForm.valid) {
      const plantData = this.plantForm.value;
      const selectedPlantType = plantData.plantType as PlantType;

      const speciesId = selectedPlantType?.Id ?? selectedPlantType?.id;
      const commonName =
        selectedPlantType?.CommonName ?? selectedPlantType?.commonName;

      if (!speciesId) {
        this.error = 'Invalid plant type selected';
        return;
      }

      const transformedData = {
        Name: commonName,
        Nickname: plantData.name,
        Species: Number(speciesId),
        DateAdded: this.toLocalDate(plantData.plantedDate),
        UserId: this.plantService.currentUserId,
      };

      this.plantService.savePlant(transformedData).subscribe({
        next: (response) => {
          this.snackBar.open('✅ Plant added successfully!', 'Close', {
            duration: 3000,
          });
          this.plantAdded.emit();
          this.dialogRef.close(true); // Close dialog with true to indicate success
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
