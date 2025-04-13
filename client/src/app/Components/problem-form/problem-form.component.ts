import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
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
})
export class ProblemFormComponent implements OnInit {
  @Input() plantId!: number;

  problemForm!: FormGroup;
  statusMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private problemService: ProblemService
  ) {}

  ngOnInit(): void {
    this.problemForm = this.fb.group({
      severity: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(5)]],
      dateReported: [new Date(), Validators.required],
      plantId: [this.plantId, Validators.required],
    });
  }

  submitProblem(): void {
    if (this.problemForm.valid) {
      const report: ProblemReport = this.problemForm.value;
      this.problemService.createProblem(report).subscribe({
        next: () => (this.statusMessage = '✅ Problem reported!'),
        error: () => (this.statusMessage = '❌ Failed to submit report.'),
      });
    }
  }
}
