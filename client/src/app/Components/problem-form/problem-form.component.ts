import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors,} from '@angular/forms';
import { trigger, state, style, transition, animate,} from '@angular/animations';
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

export interface ProblemDialogData {
  mode: 'add' | 'edit';
  plantId: number;
  problemData?: ProblemReport;
}

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
  mode: 'add' | 'edit' = 'add'; // Default to add mode
  private problemId: number | null = null; // To store the Id when editing

  constructor(
    private fb: FormBuilder,
    private problemService: ProblemService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ProblemFormComponent>,
    // Inject the data using the interface
    @Inject(MAT_DIALOG_DATA) private data: ProblemDialogData
  ) {}

  ngOnInit(): void {
    this.mode = this.data.mode;

    this.problemForm = this.fb.group({
      severity: ['', [Validators.required]],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(1000),
        ],
      ],
      dateReported: [
        '',
        [Validators.required, this.dateNotInFutureValidator()],
      ]
    });

    if (this.mode === 'edit' && this.data.problemData) {
      this.problemId = this.data.problemData.id ?? null;
      this.problemForm.patchValue({
        severity: this.data.problemData.severity,
        description: this.data.problemData.description,
        dateReported: this.data.problemData.dateReported
          ? new Date(this.data.problemData.dateReported)
          : '',
      });
    }
  }

  private dateNotInFutureValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const inputDate = new Date(control.value);
      inputDate.setHours(0, 0, 0, 0);

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

      // Construct the payload, include plantId from the injected data
      const payload: Omit<ProblemReport, 'id'> & { id?: number } = {
        severity: formValue.severity,
        description: formValue.description,
        dateReported: this.toLocalDate(formValue.dateReported),
        plantId: this.data.plantId 
      };

      if (this.mode === 'edit' && this.problemId !== null) {
        this.problemService
          .updateProblem(this.problemId, payload as ProblemReport)
          .subscribe({
            next: () => {
              this.snackBar.open('✅ Problem updated!', 'Close', {duration: 3000});
              this.dialogRef.close(true); 
            },
            error: () => {
              this.snackBar.open('❌ Failed to update problem.', 'Close', {duration: 3000});
            },
          });
      } else // add new problem
        {
        this.problemService.createProblem(payload as ProblemReport).subscribe({
          next: () => {
            this.snackBar.open('✅ Problem reported!', 'Close', {duration: 3000});
            this.dialogRef.close(true); 
          },
          error: () => {
            this.snackBar.open('❌ Failed to submit problem.', 'Close', {duration: 3000});
          },
        });
      }
    } else {
      Object.keys(this.problemForm.controls).forEach((key) => {
        const control = this.problemForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
