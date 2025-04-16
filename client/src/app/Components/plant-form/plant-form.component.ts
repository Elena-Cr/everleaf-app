import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { PlantService } from '../../Services/plant.service'; // Adjust path as needed
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { Observable } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-plant-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
  ],
  templateUrl: './plant-form.component.html',
  styleUrls: ['./plant-form.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [animate('300ms ease-in')]),
    ]),
  ],
})
export class PlantFormComponent implements OnInit {
  plantForm!: FormGroup;
  plantTypes$: Observable<any[]> | undefined;
  form: any;

  constructor(
    private fb: FormBuilder,
    private plantService: PlantService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.plantForm = this.fb.group({
      name: ['', Validators.required],
      plantedDate: ['', Validators.required],
      plantType: ['', Validators.required],
    });

    this.loadPlantTypes();
    console.log('this.plantTypes$', this.plantTypes$);
  }

  loadPlantTypes(): void {
    this.plantTypes$ = this.plantService.getPlantTypes();
  }

  toLocalDate(date: Date): string {
    const localISO = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0]; // → returns "2025-04-01"
    return `${localISO}T00:00:00`; // normalized to midnight local time
  }

  onSubmit(): void {
    if (this.plantForm.valid) {
      const plantData = this.plantForm.value;

      const transformedData = {
        Name: plantData.plantType.commonName,
        Nickname: plantData.name,
        DateAdded: this.toLocalDate(plantData.plantedDate),
        UserId: 1, // Replace with actual user ID
        Species: Number(plantData.plantType.id),
      };

      this.plantService.savePlant(transformedData).subscribe({
        next: () => {
          this.snackBar.open('✅ Care log submitted!', 'Close', {
            duration: 3000,
          });
          this.plantForm.reset({
            name: '',
            plantedDate: '',
            plantType: '',
          });
        },
        error: () => {
          this.snackBar.open('❌ Failed to submit care log.', 'Close', {
            duration: 3000,
          });
        },
      });
    } else {
      this.plantForm.markAllAsTouched(); // trigger validations
    }
  }
}
