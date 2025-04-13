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
import { CareLogService } from '../../Services/carelog.service';
import { CareLog } from '../../Models/care-log';

@Component({
  selector: 'app-care-log-form',
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
  templateUrl: './care-log-form.component.html',
  styleUrl: './care-log-form.component.css',
})
export class CareLogFormComponent implements OnInit {
  @Input() plantId!: number;

  careLogForm!: FormGroup;
  statusMessage = '';

  constructor(
    private fb: FormBuilder,
    private careLogService: CareLogService
  ) {}

  ngOnInit(): void {
    this.careLogForm = this.fb.group({
      action: ['', Validators.required],
      date: ['', Validators.required],
      notes: [''],
      plantId: [this.plantId, Validators.required],
    });
  }

  submitCareLog(): void {
    if (this.careLogForm.valid) {
      const formValue: CareLog = this.careLogForm.value;
      this.careLogService.createCareLog(formValue).subscribe({
        next: () => (this.statusMessage = '✅ Care log submitted!'),
        error: () => (this.statusMessage = '❌ Failed to submit care log.'),
      });
    }
  }
}
