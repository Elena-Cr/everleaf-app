import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
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
  ],
  templateUrl: './problem-form.component.html',
  styleUrls: ['./problem-form.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [animate('300ms ease-in')]),
    ]),
  ],
})
export class ProblemFormComponent implements OnInit {
  @Input() plantId!: number;

  problemForm!: FormGroup;
  statusMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private problemService: ProblemService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.problemForm = this.fb.group({
      severity: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(5)]],
      dateReported: [new Date(), Validators.required], // ✅ default to today
      plantId: [this.plantId, Validators.required],
    });
  }

  toLocalDate(date: Date): string {
    const localISO = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0]; // → returns "2025-04-01"
    return `${localISO}T00:00:00`; // normalized to midnight local time
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
          this.problemForm.reset({
            issueType: '',
            description: '',
            dateReported: new Date(),
            plantId: this.plantId,
          });
        },
        error: () => {
          this.snackBar.open('❌ Failed to submit problem.', 'Close', {
            duration: 3000,
          });
        },
      });
    }
  }
}
