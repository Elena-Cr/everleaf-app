import { Component, EventEmitter, Inject, OnInit, Optional, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import { PlantService } from '../../Services/plant.service';
import { BehaviorSubject, finalize, tap } from 'rxjs';
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
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { A11yModule } from '@angular/cdk/a11y';
import { PlantType } from '../../Models/plant-type';
import { Plant } from '../../Models/plant';
import { CareLog } from '../../Models/care-log';
import { MatIconModule } from '@angular/material/icon';

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
    MatIconModule,
    A11yModule,
  ],
})

export class PlantFormComponent implements OnInit {
  plantForm: FormGroup;
  private plantTypesSubject = new BehaviorSubject<PlantType[]>([]);
  plantTypes$ = this.plantTypesSubject.asObservable();
  careLogs: CareLog[] = [];
  loading = false;
  loadingLogs = false;
  error: string | null = null;

  @Output() plantAdded = new EventEmitter<void>();

  constructor(
    private formBuilder: FormBuilder,
    private plantService: PlantService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<PlantFormComponent>,
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public data: { mode: 'add' | 'edit'; plant?: Plant } | null
  ) {
    this.plantForm = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      plantType: ['', [Validators.required]],
      plantedDate: ['', [Validators.required, this.dateNotInFutureValidator()]],
    });
  }

  // Custom validator for date not in future
  private dateNotInFutureValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const today = new Date();
      const inputDate = new Date(control.value);
      return inputDate > today ? { futureDate: true } : null;
    };
  }

  ngOnInit(): void {
    this.loadPlantTypes();

    if (
      this.data?.mode === 'edit' &&
      this.data.plant &&
      typeof this.data.plant.id === 'number'
    ) {
      const plant = this.data.plant;

      this.plantForm.patchValue({
        name: plant.nickname,
        plantType: { id: plant.species, commonName: plant.name },
        plantedDate: new Date(plant.dateAdded),
      });
    }
  }

  loadPlantTypes(): void {
    this.loading = true;
    this.error = null;

    this.plantService
      .getPlantTypes()
      .pipe(finalize(() => (this.loading = false)))
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
      const formValues = this.plantForm.value;
      const selectedPlantType = formValues.plantType as PlantType;

      const speciesId = selectedPlantType?.Id ?? selectedPlantType?.id;
      const commonName =
        selectedPlantType?.CommonName ?? selectedPlantType?.commonName;

      if (!speciesId) {
        this.error = 'Invalid plant type selected';
        return;
      }

      const transformedData = {
        Name: commonName,
        Nickname: formValues.name,
        Species: Number(speciesId),
        DateAdded: this.toLocalDate(formValues.plantedDate),
        UserId: this.plantService.currentUserId,
      };

      if (this.data?.mode === 'edit' && this.data?.plant?.id) {
        this.plantService
          .updatePlant(this.data.plant.id, transformedData)
          .subscribe({
            next: () => {
              this.snackBar.open('✅ Plant updated successfully!', 'Close', {duration: 3000});
              this.dialogRef.close(true);
            },
            error: (error: HttpErrorResponse) => {
              console.error('Error updating plant:', error);
              this.error = error.message || 'Failed to update plant.';
            },
          });
      } else {
        this.plantService.savePlant(transformedData).subscribe({
          next: () => {
            this.snackBar.open('✅ Plant added successfully!', 'Close', {duration: 3000});
            this.dialogRef.close(true);
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error saving plant:', error);
            this.error = error.message || 'Failed to save plant.';
          },
        });
      }
    } 
  }
}
