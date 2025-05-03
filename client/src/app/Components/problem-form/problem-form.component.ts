import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { ProblemService } from '../../Services/problem.service';
import { ProblemReport } from '../../Models/problem-reports';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-problem-form',
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
    MatSnackBarModule,
    MatDialogModule,
  ],
  templateUrl: './problem-form.component.html',
  styleUrls: ['./problem-form.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      state('in', style({ opacity: 1 })),
      transition('void => in', [animate('300ms ease-in')]),
    ]),
  ],
})
export class ProblemFormComponent implements OnInit {
  problemForm!: FormGroup;
  statusMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private problemService: ProblemService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ProblemFormComponent>,
    @Inject(MAT_DIALOG_DATA) private plantId: number
  ) {}

  ngOnInit(): void {
    this.problemForm = this.fb.group({
      severity: ['', [Validators.required]],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(1000),
        ],
      ],
      dateReported: [
        '',
        [Validators.required, this.dateNotInFutureValidator()],
      ],
      plantId: [this.plantId, Validators.required],
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

  toLocalDate(date: Date): string {
    const localISO = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];
    return `${localISO}T00:00:00`;
  }

  submitProblem(): void {
    if (this.problemForm.valid) {
      const formValue = this.problemForm.value;

      const payload = {
        ...formValue,
        dateReported: this.toLocalDate(formValue.dateReported),
      };

      this.problemService.createProblem(payload).subscribe({
        next: () => {
          this.snackBar.open('✅ Problem reported!', 'Close', {
            duration: 3000,
          });
          this.dialogRef.close(true);
        },
        error: () => {
          this.snackBar.open('❌ Failed to submit problem.', 'Close', {
            duration: 3000,
          });
        },
      });
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.problemForm.controls).forEach((key) => {
        const control = this.problemForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
